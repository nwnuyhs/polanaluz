/**
 * 着色器。思路：每个像素先确定看到的是哪个表面上的点 P（地面 / 后墙 / 侧墙）。
 * 从 P 朝太阳方向射一条光线，和每组窗户所在的平面求交，得到窗户坐标 uv，
 * 在玻璃图案上取色，就是落在 P 点的光。
 * 柔边：离窗户越远（t 越大），太阳圆盘在窗面上覆盖的范围越大 → 多点采样做圆盘模糊。
 * 房间模式下再沿视线积分空气中被照亮的部分，得到体积光（光柱）。
 */

export const MAX_WINDOWS = 4;
const TAPS = 24;

export const VERT = /* glsl */ `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
out vec2 vUv;
void main() {
  vec2 p = P[gl_VertexID];
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

export const FRAG = /* glsl */ `#version 300 es
precision highp float;
precision highp sampler2DArray;

#define MAX_W ${MAX_WINDOWS}
#define TAPS ${TAPS}
#define PATTERN_SIZE 512.0

in vec2 vUv;
out vec4 outColor;

uniform sampler2DArray uPattern;
uniform float uAspect;

// 相机
uniform vec3 uCamPos;
uniform vec3 uCamF;
uniform vec3 uCamR;
uniform vec3 uCamU;
uniform float uCamK;

// 太阳
uniform vec3 uL;         // 指向太阳的单位向量
uniform vec3 uSunColor;  // 线性空间，已乘强度
uniform float uSoft;     // tan(太阳角半径)

// 窗户组
uniform int uCount;
uniform vec3 uWC[MAX_W];
uniform vec3 uWU[MAX_W];
uniform vec3 uWV[MAX_W];
uniform vec3 uWN[MAX_W];
uniform vec2 uWHalf[MAX_W];
uniform float uWGain[MAX_W];
uniform int uWMount[MAX_W]; // 0 只投影 1 后墙 2 右侧墙
uniform vec3 uWL[MAX_W];     // 每扇窗各自的光线方向（指向光源）
uniform vec4 uWGrid[MAX_W];  // 微软式窗格：列数、行数、窗棂宽度（uv）、是否窗格（1/0）
#define PANES_BORDER 0.015625
uniform vec4 uWSrc[MAX_W];   // 发散光：光源位置 xyz、到窗户的距离 w（0 = 平行光）

// 表面与画面
uniform vec3 uBg;          // 线性空间
uniform int uTexture;      // 0 无 1 马赛克 2 水磨石 3 清水混凝土 4 纸张
uniform float uTexScale;
uniform float uTexStrength;
uniform int uTheme;        // 0 深色发光 1 浅色染色
uniform float uOpacity;
uniform float uExposure;
uniform float uGlow;
uniform float uCaustics;
uniform float uSeed;
uniform float uShade;
uniform float uFade;
uniform float uVignette;
uniform float uGrain;
uniform float uTime;

// 焦点元素（地面坐标）
uniform int uFocusOn;
uniform vec2 uFocusC;
uniform vec2 uFocusHalf;
uniform float uFocusR;
uniform float uFocusLift;
uniform float uFocusShadow;
uniform float uFocusRim;
uniform float uFocusRimW;
uniform float uFocusInside;
uniform vec4 uFocusS;      // 屏幕空间（单位 = 画布高度，y 向上）：中心 xy、半宽高 zw
uniform vec2 uFocusSR;     // 屏幕空间：圆角、描边光宽度

// 房间
uniform int uRoom;
uniform float uWallY;
uniform float uSideX;
uniform vec3 uRoomColor;   // 线性空间
uniform float uAmbient;
uniform float uHaze;
uniform float uWinGlow;
uniform float uBottomFade;
uniform float uPanel;
uniform float uGloss;
uniform int uFloor;
uniform float uDust;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i), b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0)), d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return s / 0.9375;
}

// 交错梯度噪声：每个像素旋转采样圆盘，消除模糊的条纹
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }

vec2 vogel(int k, float rot) {
  float r = sqrt((float(k) + 0.5) / float(TAPS));
  float a = float(k) * 2.39996323 + rot;
  return r * vec2(cos(a), sin(a));
}

// 窗外一律不透光（不能依赖纹理边缘钳制：粗 mip 层的边缘像素已混入玻璃颜色）
// 边界按当前 mip 层的像素宽度平滑淡出，否则多点采样会出现一圈圈窗框残影
vec3 tapPattern(int i, vec2 uv, float lod) {
  vec2 a = abs(uv);
  if (any(greaterThan(a, vec2(1.0)))) return vec3(0.0);
  float e = exp2(lod) * 3.0 / PATTERN_SIZE;
  vec2 m = 1.0 - smoothstep(vec2(1.0 - e), vec2(1.0), a);
  vec2 tc = vec2(0.5 + 0.5 * uv.x, 0.5 - 0.5 * uv.y);
  return textureLod(uPattern, vec3(tc, float(i)), lod).rgb * (m.x * m.y);
}

// 手工玻璃厚薄起伏造成的焦散：q 是窗面上的坐标（地面单位）。
// 细亮纹（扭曲噪声的脊线）+ 大块明暗；半影越大，细纹越被抹平。
float caustic(vec2 q, float seed, float blur) {
  if (uCaustics <= 0.0) return 1.0;
  vec2 p = q * vec2(4.2, 1.9) + seed * 13.7;
  vec2 warp = vec2(fbm(p * 0.6), fbm(p * 0.6 + 5.2));
  float n = fbm(p + warp * 1.8);
  float ridge = pow(1.0 - abs(n * 2.0 - 1.0), 5.0);
  float body = fbm(p * 0.35 + 3.1) - 0.5;
  float sharp = clamp(1.0 - blur * 5.0, 0.0, 1.0);
  return max(0.0, 1.0 + uCaustics * (sharp * (ridge * 1.1 - 0.2) + body * 0.7));
}

// 地面反照率（纹理）：返回约 0.6..1.3 的亮度系数
float floorAlbedo(vec2 p) {
  if (uTexture == 0 || uTexStrength <= 0.0) return 1.0;
  vec2 q = p / max(uTexScale, 1e-3);
  float w = max(fwidth(q.x), fwidth(q.y));
  float v = 1.0;
  if (uTexture == 1) {
    // 马赛克：小砖亮度参差、浅砖缝、大面积有轻微的旧化深浅（不是规则网格）
    vec2 id = floor(q);
    vec2 f = fract(q);
    float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
    float grout = smoothstep(0.0, 0.07 + w, edge);
    float h = hash21(id);
    float tile = 0.8 + 0.3 * h - step(0.92, h) * 0.25;
    tile *= 0.88 + 0.24 * fbm(q * 0.06);
    v = tile * mix(0.8, 1.0, grout);
    v = mix(v, 0.93 + 0.12 * fbm(q * 0.06), smoothstep(0.3, 0.8, w)); // 砖比像素还小时取平均，避免闪烁
  } else if (uTexture == 2) {
    // 水磨石：两层大小不同的碎石点
    float s = 0.0;
    for (int l = 0; l < 2; l++) {
      vec2 qq = q * (l == 0 ? 1.0 : 2.7);
      vec2 id = floor(qq);
      vec2 c = vec2(hash21(id), hash21(id + 7.1));
      float r = 0.12 + 0.22 * hash21(id + 3.3);
      float d = length(fract(qq) - c);
      float dot_ = 1.0 - smoothstep(r - max(w, 0.02), r, d);
      s += dot_ * (hash21(id + 9.7) - 0.45) * (l == 0 ? 0.9 : 0.6);
    }
    v = 1.0 + s;
    v = mix(v, 1.0, smoothstep(0.3, 0.8, w));
  } else if (uTexture == 3) {
    // 清水混凝土：大块深浅 + 细砂粒 + 零星气孔
    float fine = clamp(1.0 - w * 4.0, 0.0, 1.0);
    v = 0.84 + 0.32 * fbm(q * 0.5) + (vnoise(q * 7.0) - 0.5) * 0.22 * fine;
    float pit = step(0.965, hash21(floor(q * 3.0))) * (1.0 - smoothstep(0.08, 0.2, length(fract(q * 3.0) - 0.5)));
    v -= pit * 0.35 * fine;
  } else {
    // 纸张：极细的均匀颗粒 + 非常轻的云纹（浅色网页底色要干净，不能出现拉丝或脏斑）
    float fine = clamp(1.0 - w * 3.0, 0.0, 1.0);
    v = 1.0 + (fbm(q * 0.7) - 0.5) * 0.08 + (vnoise(q * 22.0) - 0.5) * 0.08 * fine;
  }
  return mix(1.0, v, uTexStrength);
}

float sdRoundRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// 空间中一点 P 收到的光（light = 清晰部分，halo = 光晕）
void lightAt(vec3 P, float rot, bool occlude, out vec3 light, out vec3 halo) {
  light = vec3(0.0);
  halo = vec3(0.0);
  for (int i = 0; i < MAX_W; i++) {
    if (i >= uCount) break;
    vec3 N = uWN[i];
    bool pointSrc = uWSrc[i].w > 0.0;
    vec3 L = pointSrc ? normalize(uWSrc[i].xyz - P) : uWL[i];
    float denom = dot(L, N);
    if (abs(denom) < 1e-3) continue;
    float t = dot(uWC[i] - P, N) / denom;
    if (t <= 1e-3) continue; // 窗面本身（墙上的点）不算，否则浮点误差会让像素随机亮暗
    vec3 d = P + t * L - uWC[i];
    vec2 half_ = uWHalf[i];
    vec2 q = vec2(dot(d, uWU[i]), dot(d, uWV[i]));
    vec2 uv = q / half_;

    // 半影：太阳圆盘在窗面上的半径（斜射时被拉大）
    float r = t * uSoft / max(abs(denom), 0.25);
    vec2 ruv = vec2(r) / half_;
    // 光晕：只比半影略大一圈（地面单位，不随窗户大小变）
    vec2 gr = vec2(r * 1.5 + 0.035) / half_;
    vec2 reach = max(ruv, gr);
    if (any(greaterThan(abs(uv) - reach, vec2(1.02)))) continue;

    float lod = max(0.0, log2(max(max(ruv.x, ruv.y) * 0.5 * PATTERN_SIZE * 0.8, 1.0)));
    float glod = max(0.0, log2(max(max(gr.x, gr.y) * 0.5 * PATTERN_SIZE * 1.0, 1.0)));

    vec3 acc = vec3(0.0);
    for (int k = 0; k < TAPS; k++) {
      acc += tapPattern(i, uv + vogel(k, rot) * ruv, lod);
    }
    acc /= float(TAPS);

    // 固定的 8 点圆环 + 中心，不做逐像素旋转（避免噪点），靠粗 mip 层保证平滑
    vec3 h = tapPattern(i, uv, glod);
    for (int k = 0; k < 8; k++) {
      float a = float(k) * 0.78539816;
      h += tapPattern(i, uv + vec2(cos(a), sin(a)) * gr * 0.7, glod);
    }
    h /= 9.0;

    float atten = uWGain[i] * exp(-uFade * t * 0.1);
    if (pointSrc) {
      vec3 dS = P - uWSrc[i].xyz;
      atten *= min(uWSrc[i].w * uWSrc[i].w / dot(dS, dS), 1.5);
    }
    // 焦点元素（搜索框）挡住这束光：从 P 沿这束光走到元素高度，落在元素里就在影子中
    if (occlude && uFocusOn == 1) {
      vec2 rel = P.xy - uFocusC;
      if (sdRoundRect(rel, uFocusHalf, uFocusR) > 0.0) {
        float lz = max(L.z, 0.05);
        vec2 hp = rel + L.xy * (uFocusLift / lz);
        float pen = uFocusLift * uSoft / lz * 2.5 + 0.02;
        atten *= 1.0 - uFocusShadow * (1.0 - smoothstep(-pen, pen, sdRoundRect(hp, uFocusHalf, uFocusR)));
      }
    }
    light += acc * caustic(q, uSeed + float(i) * 7.31, r) * atten;
    halo += h * atten;
  }
  light *= uSunColor;
  halo *= uSunColor;
}

// 体积光（解析）：光穿过窗户后在空气里形成一根"棱柱"。
// 视线 X(t) = ro + rd·t 沿光线投到窗面上的坐标 uv(t) 是 t 的线性函数，
// 所以视线在光柱里的那一段 [t0, t1] 可以直接解出来 —— 边缘精确，不会有步进噪点。
// 保留 p + q·t >= 0 的部分
void clipLin(float p, float q, inout float t0, inout float t1) {
  if (abs(q) < 1e-8) {
    if (p < 0.0) t1 = -1.0;
    return;
  }
  float tc = -p / q;
  if (q > 0.0) t0 = max(t0, tc); else t1 = min(t1, tc);
}

// 发散光的体积光：光源 S 在窗后不远处。视线上一点沿"到 S 的连线"投到窗面，
// 坐标是 t 的分式线性函数 a(t) / n(t)；"落在某块玻璃里"化成关于 t 的线性不等式，
// 区间仍然可以直接解出来 —— 光束呈扇形张开，边缘和窗缝依然锐利。
vec3 volPoint(int i, vec3 ro, vec3 rd, float tMax) {
  vec3 Sx = uWSrc[i].xyz;
  float D = uWSrc[i].w;
  vec3 C = uWC[i], N = uWN[i], U = uWU[i], V = uWV[i];
  vec2 half_ = uWHalf[i];
  float cN = dot(C - Sx, N);
  if (abs(cN) < 1e-5) return vec3(0.0);
  float sg = sign(cN);
  vec3 w0 = ro - Sx;
  float n0 = dot(w0, N), n1 = dot(rd, N);
  float T0 = 0.0, T1 = tMax;
  // 视线上的点在窗户"室内"一侧：n 与 cN 同号且 |n| > |cN|
  clipLin(sg * n0 - abs(cN), sg * n1, T0, T1);
  if (T1 <= T0) return vec3(0.0);
  float su = dot(Sx - C, U), sv = dot(Sx - C, V);
  vec2 a0 = vec2(su * n0 + cN * dot(w0, U), sv * n0 + cN * dot(w0, V));
  vec2 a1 = vec2(su * n1 + cN * dot(rd, U), sv * n1 + cN * dot(rd, V));
  vec4 grid = uWGrid[i];
  bool panes = grid.w > 0.5;
  float cols = panes ? grid.x : 1.0, rows = panes ? grid.y : 1.0, mu = panes ? grid.z : 0.0;
  float bu = panes ? PANES_BORDER : 0.0;
  float cwu = (2.0 - 2.0 * bu) / cols, chu = (2.0 - 2.0 * bu) / rows;
  vec3 c = vec3(0.0);
  for (int r = 0; r < 4; r++) {
    if (float(r) >= rows) break;
    for (int k = 0; k < 4; k++) {
      if (float(k) >= cols) break;
      float x0 = -1.0 + bu + float(k) * cwu + mu * 0.5;
      float y1 = 1.0 - bu - float(r) * chu - mu * 0.5;
      vec2 lo = vec2(x0, y1 - (chu - mu)) * half_;
      vec2 hi = vec2(x0 + cwu - mu, y1) * half_;
      float t0 = T0, t1 = T1;
      for (int a = 0; a < 2; a++) {
        clipLin(sg * (a0[a] - lo[a] * n0), sg * (a1[a] - lo[a] * n1), t0, t1);
        clipLin(sg * (hi[a] * n0 - a0[a]), sg * (hi[a] * n1 - a1[a]), t0, t1);
      }
      if (t1 <= t0) continue;
      float len = t1 - t0;
      vec3 pc = vec3(0.0);
      for (int m = 0; m < 4; m++) {
        float t = t0 + len * (float(m) + 0.5) / 4.0;
        vec2 uv = (a0 + a1 * t) / ((n0 + n1 * t) * half_);
        vec3 X = ro + rd * t;
        float dist2 = dot(X - Sx, X - Sx);
        // 越远越淡（光束张开，能量被摊薄）
        float fall = min(D * D / dist2, 1.5);
        float phase = 0.55 + 1.2 * pow(max(dot(rd, normalize(Sx - X)), 0.0), 3.0);
        pc += tapPattern(i, uv, 1.0) * fall * phase * exp(-uFade * sqrt(dist2) * 0.1);
      }
      c += pc / 4.0 * len;
    }
  }
  return c * uWGain[i];
}

vec3 volBeams(vec3 ro, vec3 rd, float tMax, float jit) {
  vec3 sum = vec3(0.0);
  for (int i = 0; i < MAX_W; i++) {
    if (i >= uCount) break;
    if (uWGain[i] <= 0.0) continue;
    if (uWSrc[i].w > 0.0) {
      sum += volPoint(i, ro, rd, tMax);
      continue;
    }
    vec3 L = uWL[i];
    vec3 N = uWN[i];
    float denom = dot(L, N);
    if (abs(denom) < 1e-3) continue;
    vec2 half_ = uWHalf[i];
    float s0 = dot(uWC[i] - ro, N) / denom; // 沿光线到窗面的距离（t = 0 时）
    float s1 = -dot(rd, N) / denom;         // ds/dt
    vec3 d0 = ro + s0 * L - uWC[i];
    vec3 dd = rd + s1 * L;
    vec2 A = vec2(dot(d0, uWU[i]), dot(d0, uWV[i])) / half_;
    vec2 B = vec2(dot(dd, uWU[i]), dot(dd, uWV[i])) / half_;
    float T0 = 0.0, T1 = tMax;
    // 只算窗户"室内"一侧（s > 0）
    if (abs(s1) < 1e-6) {
      if (s0 <= 0.0) continue;
    } else {
      float ts = -s0 / s1;
      if (s1 > 0.0) T0 = max(T0, ts); else T1 = min(T1, ts);
    }
    if (T1 <= T0) continue;
    float phase = 0.55 + 1.2 * pow(max(dot(rd, L), 0.0), 3.0);
    vec4 grid = uWGrid[i];
    vec3 c = vec3(0.0);

    if (grid.w > 0.5) {
      // 微软式窗格：每块玻璃各自是一根光柱，逐块解出区间 —— 光柱和窗缝都是锐利的
      float cols = grid.x, rows = grid.y, mu = grid.z;
      float cwu = (2.0 - 2.0 * PANES_BORDER) / cols;
      float chu = (2.0 - 2.0 * PANES_BORDER) / rows;
      for (int r = 0; r < 4; r++) {
        if (float(r) >= rows) break;
        for (int k = 0; k < 4; k++) {
          if (float(k) >= cols) break;
          float x0 = -1.0 + PANES_BORDER + float(k) * cwu + mu * 0.5;
          float y1 = 1.0 - PANES_BORDER - float(r) * chu - mu * 0.5;
          vec2 lo = vec2(x0, y1 - (chu - mu));
          vec2 hi = vec2(x0 + cwu - mu, y1);
          float t0 = T0, t1 = T1;
          for (int a = 0; a < 2; a++) {
            if (abs(B[a]) < 1e-6) {
              if (A[a] < lo[a] || A[a] > hi[a]) t1 = -1.0;
              continue;
            }
            float ta = (lo[a] - A[a]) / B[a], tb = (hi[a] - A[a]) / B[a];
            t0 = max(t0, min(ta, tb));
            t1 = min(t1, max(ta, tb));
          }
          if (t1 <= t0) continue;
          float len = t1 - t0;
          vec3 pc = vec3(0.0);
          for (int m = 0; m < 3; m++) {
            float t = t0 + len * (float(m) + 0.5) / 3.0;
            pc += tapPattern(i, A + B * t, 1.0) * exp(-uFade * (s0 + s1 * t) * 0.1);
          }
          c += pc / 3.0 * len;
        }
      }
    } else {
      float t0 = T0, t1 = T1;
      for (int k = 0; k < 2; k++) {
        float a = A[k], b = B[k];
        if (abs(b) < 1e-6) {
          if (abs(a) > 1.0) t1 = -1.0;
          continue;
        }
        float ta = (-1.0 - a) / b, tb = (1.0 - a) / b;
        t0 = max(t0, min(ta, tb));
        t1 = min(t1, max(ta, tb));
      }
      if (t1 <= t0) continue;
      // 光柱内部的颜色：少量采样 + 抖动
      const int M = 10;
      float len = t1 - t0;
      for (int m = 0; m < M; m++) {
        float t = t0 + len * (float(m) + jit) / float(M);
        float sd = s0 + s1 * t;
        float rr = sd * uSoft / max(abs(denom), 0.25);
        float lod = max(0.0, log2(max(max(rr / half_.x, rr / half_.y) * 0.5 * PATTERN_SIZE * 0.8, 1.0))) + 1.0;
        c += tapPattern(i, A + B * t, lod) * exp(-uFade * sd * 0.1);
      }
      c *= len / float(M);
    }
    sum += c * uWGain[i] * phase;
  }
  return sum * uSunColor;
}

// 焦点元素（搜索框）：悬浮在光里的一块板 —— 影子、贴地遮蔽、边缘受光、板内透光
void applyFocus(vec3 P, float rot, inout vec3 light, inout vec3 halo, inout float ao) {
  vec2 rel = P.xy - uFocusC;
  float boxD = sdRoundRect(rel, uFocusHalf, uFocusR);
  // （投影已在 lightAt 里按每束光分别计算）
  // 贴近元素的一圈很淡的环境遮蔽，让它"浮"起来
  ao *= 1.0 - uFocusShadow * 0.12 * exp(-max(boxD, 0.0) / (uFocusRimW * 3.0)) * step(0.0, boxD);

  if (boxD < uFocusRimW * 8.0) {
    vec3 l2, h2;
    lightAt(vec3(P.xy, uFocusLift), rot, false, l2, h2);
    l2 += h2 * 0.6;
    if (boxD < 0.0) {
      light = l2 * uFocusInside;
      halo = vec3(0.0);
    }
    // 描边光：光扫过元素边缘，沿边缘向外衰减
    float rim = exp(-abs(boxD) / uFocusRimW) * (boxD < 0.0 ? 0.35 : 1.0);
    light += l2 * rim * uFocusRim;
  }
}

// 墙面面板分缝：细的暗线
float panelSeams(vec2 p) {
  if (uPanel <= 0.0) return 1.0;
  vec2 q = p / uPanel;
  vec2 f = abs(fract(q) - 0.5);
  vec2 w = fwidth(q);
  vec2 l = smoothstep(vec2(0.5) - w * 1.5 - 0.006, vec2(0.5), f);
  return 1.0 - (uTheme == 1 ? 0.05 : 0.1) * max(l.x, l.y);
}

// 墙上的窗户本身：玻璃发光 + 窗外一圈辉光（用图案的平均色）
vec3 windowEmission(vec3 P, int surface, float lod) {
  vec3 e = vec3(0.0);
  for (int i = 0; i < MAX_W; i++) {
    if (i >= uCount) break;
    if (uWMount[i] != surface) continue;
    vec3 d = P - uWC[i];
    vec2 half_ = uWHalf[i];
    vec2 q = vec2(dot(d, uWU[i]), dot(d, uWV[i]));
    vec2 uv = q / half_;
    float g = uWGain[i];
    // 玻璃：取较平滑的层级（通透、不出颗粒），上半部略亮
    float lift_ = 0.9 + 0.2 * clamp(uv.y * 0.5 + 0.5, 0.0, 1.0);
    e += tapPattern(i, uv, lod) * g * lift_ * 0.6;
    // 辉光：窗外一圈 + 窗棂上（窗棂被两侧的光照亮，不是死黑）
    vec3 avg = textureLod(uPattern, vec3(0.5, 0.5, float(i)), 9.0).rgb * 2.0;
    float sd = length(max(abs(q) - half_, 0.0));
    // 玻璃内部只留很弱的辉光（只为照亮窗棂），否则会把玻璃的颜色冲淡
    e += avg * g * (exp(-sd * 5.0) * 0.3 + exp(-sd * 1.4) * 0.08) * (sd > 0.0 ? 1.0 : 0.3);
  }
  return e * uSunColor * uWinGlow;
}

// 空气中的浮尘：三层不同大小、不同速度的稀疏亮点，缓慢上飘、轻微晃动、闪烁。
// 只返回"有没有尘埃"，亮度和颜色由所在位置的光柱决定（光柱外看不见）。
float dustField(vec2 p, float t) {
  float s = 0.0;
  for (int l = 0; l < 3; l++) {
    float fl = float(l);
    float sc = 34.0 + fl * 22.0;
    vec2 q = p * sc + vec2(t * (0.05 + 0.03 * fl), -t * (0.09 + 0.04 * fl)) * sc * 0.1;
    vec2 id = floor(q);
    vec2 f = fract(q);
    float h = hash21(id + fl * 17.0);
    if (h < 0.9) continue;
    vec2 c = vec2(hash21(id + 3.1), hash21(id + 7.7)) * 0.6 + 0.2;
    c += 0.12 * vec2(sin(t * 0.5 + h * 40.0), cos(t * 0.43 + h * 31.0));
    float r = 0.07 + 0.08 * hash21(id + 9.2);
    float tw = 0.55 + 0.45 * sin(t * (0.8 + h * 1.5) + h * 50.0);
    s += smoothstep(r, r * 0.2, length(f - c)) * tw * (1.0 - fl * 0.25);
  }
  return s;
}

// 没有地面时往下看到的空间：越往下越暗的柔和渐变
vec3 voidColor(vec3 dir) {
  // 浅色主题下方不能发灰：只轻微变暗
  float lo = uTheme == 1 ? 0.82 : 0.3;
  return uRoomColor * uAmbient * (lo + (1.0 - lo) * smoothstep(-0.45, 0.12, dir.z));
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 ndc = vUv * 2.0 - 1.0;
  vec3 dir = normalize(uCamF + ndc.x * uCamK * uAspect * uCamR + ndc.y * uCamK * uCamU);
  float rot = ign(gl_FragCoord.xy) * 6.2831853;
  vec3 col;

  if (uRoom == 1) {
    // ================================================= 房间：后墙 + 地面（+ 右侧墙）
    vec3 ro = uCamPos;
    float tF = (uFloor == 1 && dir.z < -1e-5) ? -ro.z / dir.z : 1e6;
    float tW = dir.y > 1e-5 ? (uWallY - ro.y) / dir.y : 1e6;
    // 侧墙：正值在右、负值在左
    float tS = (uSideX != 0.0 && dir.x * uSideX > 1e-5) ? (uSideX - ro.x) / dir.x : 1e6;
    // 没有地面时，墙只保留地平线以上的部分（否则会无限向下延伸，露出满屏分缝）
    if (uFloor == 0) {
      if (tW < 1e5 && ro.z + dir.z * tW < 0.0) tW = 1e6;
      if (tS < 1e5 && ro.z + dir.z * tS < 0.0) tS = 1e6;
    }
    float tH = min(tF, min(tW, tS));
    bool miss = tH > 1e5; // 没有地面时，往下看是一片柔和的空间
    if (miss) tH = 40.0;
    int surface = miss ? 3 : (tH == tF ? 0 : (tH == tW ? 1 : 2));
    vec3 P = ro + dir * tH;

    vec3 light = vec3(0.0), halo = vec3(0.0);
    if (!miss) lightAt(P, rot, false, light, halo);
    float ao = 1.0;

    // 环境光：离窗越近越亮，墙角略暗
    float near = 0.0;
    for (int i = 0; i < MAX_W; i++) {
      if (i >= uCount) break;
      if (uWMount[i] == 0) continue;
      near += uWGain[i] * exp(-length(P - uWC[i]) * 0.28);
    }
    float corner = 1.0;
    if (surface == 0) corner = (1.0 - 0.45 * exp(-(uWallY - P.y) * 1.2)) * (uSideX != 0.0 ? 1.0 - 0.45 * exp(-abs(uSideX - P.x) * 1.2) : 1.0);
    else if (surface != 3 && uFloor == 1) corner = 1.0 - 0.35 * exp(-P.z * 1.4);
    vec3 ambient = uRoomColor * uAmbient * (0.7 + 0.45 * near) * corner * ao;

    // 直射光：反射时偏向白色，彩色玻璃的颜色才不会被房间色吃掉
    vec3 directAlb = mix(uRoomColor, vec3(1.0), 0.7);
    if (surface == 0) {
      float alb = floorAlbedo(P.xy);
      col = ambient * alb + directAlb * alb * (light + halo * uGlow);
      // 地面光泽：沿反射方向看到墙上发光的窗户（模糊、掠射角越大越明显）
      if (uGloss > 0.0) {
        vec3 rr = vec3(dir.xy, -dir.z);
        float tw = rr.y > 1e-5 ? (uWallY - P.y) / rr.y : 1e6;
        float ts2 = (uSideX != 0.0 && rr.x * uSideX > 1e-5) ? (uSideX - P.x) / rr.x : 1e6;
        float tr = min(tw, ts2);
        if (tr < 1e5) {
          vec3 Q = P + rr * tr;
          // 反光是模糊的（光泽地面不是镜子）
          vec3 refl = windowEmission(Q, tr == tw ? 1 : 2, 6.0);
          float fres = 0.15 + 0.85 * pow(1.0 - abs(dir.z), 4.0);
          col += refl * uGloss * fres * exp(-tr * 0.12) * 0.35;
        }
      }
    } else if (surface == 3) {
      col = voidColor(dir);
    } else {
      vec2 wp = surface == 1 ? P.xz : P.yz;
      col = ambient * panelSeams(wp) + directAlb * (light + halo * uGlow) * 0.8 + windowEmission(P, surface, 1.6);
      // 没有地面时，墙的下沿柔和地融进下方的渐变（不出现硬边）
      if (uFloor == 0) col = mix(voidColor(dir), col, smoothstep(0.0, 1.6, P.z));
    }

    // 体积光：沿视线积分空气里被照亮的部分（光柱）
    if (uHaze > 0.0) {
      float jit = hash21(gl_FragCoord.xy * 1.37 + 3.1);
      vec3 vb = volBeams(ro, dir, min(tH, 60.0), jit) * uHaze * 0.25;
      col += vb;
      light += vb * 2.0;
      if (uDust > 0.0) {
        float lum = dot(vb, vec3(0.3, 0.5, 0.2));
        col += normalize(vb + 1e-4) * 1.7 * dustField(vec2(vUv.x * uAspect, vUv.y), uTime) * uDust * min(lum * 6.0, 2.0);
      }
    }

    // 搜索框边缘受光：光柱或光斑经过的地方，框的边缘染上那束光的颜色
    if (uFocusOn == 1 && uFocusRim > 0.0) {
      vec2 sp = vec2(vUv.x * uAspect, vUv.y);
      float bd = sdRoundRect(sp - uFocusS.xy, uFocusS.zw, uFocusSR.x);
      float rim = exp(-abs(bd) / uFocusSR.y) * (bd < 0.0 ? 0.4 : 1.0);
      col += (light + halo * uGlow) * rim * uFocusRim * 0.5;
    }

    col = aces(col * uExposure);
    // ACES 输出已在 0..1，下面统一转 sRGB 前先回到"线性"的语义上不再做其他压缩
  } else {
    // ================================================= 地面（俯视）
    float tc = -uCamPos.z / min(dir.z, -1e-4);
    vec3 P = uCamPos + tc * dir;
    P.z = 0.0;

    vec3 light, halo;
    lightAt(P, rot, true, light, halo);
    float ao = 1.0;
    if (uFocusOn == 1) applyFocus(P, rot, light, halo, ao);

    float alb = floorAlbedo(P.xy);
    // 环境光不是平的：大块柔和的明暗，让地面有空间感
    float amb = 0.82 + 0.36 * fbm(P.xy * 0.18 + uSeed);

    if (uTheme == 0) {
      // 深色：像照片里的阳光 —— 保持色相压缩高光，最亮处再向白色"过曝"一点
      vec3 lit = (light + halo * uGlow) * alb * uExposure;
      float m = max(max(lit.r, lit.g), lit.b);
      vec3 tm = lit * (1.0 - exp(-m)) / max(m, 1e-4);
      tm += (1.0 - tm) * smoothstep(1.1, 4.0, m) * 0.55;
      col = uBg * alb * amb * ao + tm;
    } else {
      // 浅色：像透过彩色玻璃落在白纸上 —— 在 sRGB 空间用颜色"染"背景，光斑外略暗一点。
      // 覆盖度按三通道之和算，红绿交界处不会出现发白的接缝
      vec3 L = (light + halo * uGlow) * alb;
      float m = max(max(L.r, L.g), L.b);
      float cov = 1.0 - exp(-(L.r + L.g + L.b) * uExposure * 0.75);
      vec3 chroma = pow(L / max(m, 1e-4), vec3(1.0 / 2.2));
      vec3 bgS = pow(uBg, vec3(1.0 / 2.2)) * mix(1.0, alb, 0.6) * mix(1.0, amb, 0.04);
      vec3 s = bgS * ao * (1.0 - uShade * (1.0 - cov)) * mix(vec3(1.0), chroma, cov * 0.78);
      col = pow(s, vec3(2.2)) + uBg * cov * 0.04;
    }
  }

  // 暗角
  vec2 vq = ndc * vec2(uAspect, 1.0) / max(uAspect, 1.0);
  col *= 1.0 - uVignette * smoothstep(0.35, 1.25, length(vq));

  col = mix(uBg, col, uOpacity);
  // 底部淡出到背景色，和下面的网页内容衔接
  if (uBottomFade > 0.0) col = mix(uBg, col, smoothstep(0.0, uBottomFade, vUv.y));

  // 线性 → sRGB
  col = mix(col * 12.92, 1.055 * pow(max(col, 0.0), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, col));

  // 颗粒 + 抖动（防止渐变色带）
  float n = hash21(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5;
  col += n * (1.0 / 255.0 + uGrain * 0.05);

  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;
