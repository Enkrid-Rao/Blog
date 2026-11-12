---
title: "§3.4 狄利克雷卷积"
description: "数论函数之间的乘法结构。"
subject: math
course: number-theory
chapter: 03-arithmetic-functions
order: 4
updated: 2026-06-08
tags: [数论, 数论函数]
featured: false
---
## 狄利克雷卷积

两个数论函数 $f, g$ 的狄利克雷卷积定义为：

$$
(f * g)(n) = \sum_{d \mid n} f(d) \, g\!\left(\frac{n}{d}\right)
$$

**基本性质**：
- **交换律**：$f * g = g * f$
- **结合律**：$(f * g) * h = f * (g * h)$
- **单位元**：$\varepsilon$（即 $f * \varepsilon = f$），其中 $\varepsilon(n) = [n = 1]$
- 若 $f(1) \neq 0$，则 $f$ 存在唯一的狄利克雷逆 $f^{-1}$，满足 $f * f^{-1} = \varepsilon$

### 证明

#### 交换律

$$
\begin{aligned}
(f*g)(n)&=\sum_{d \mid n}f(d) \, g\!\left( \frac{n}{d} \right) \\
   &= \sum_{\substack{d\mid n \\ dd'=n}} f\left(\frac{n }{d'}\right)\,g\!\left(d'\right) \\
   &= \sum_{d'\mid n} g \left( d' \right)f \left( \frac{n }{d' } \right) \\
   &= \left( g*f  \right) (n)
\end{aligned}
$$
---

#### 结合律

需要证明 $(f*g)*k = f*(g*k)$。

设 $A(n) = (f*g)(n)$，则

$$
\begin{aligned}
(A*k)(n)
&= \sum_{a\mid n} A(a)\, k\!\left(\frac{n}{a}\right) \\
&= \sum_{a\mid n} \left[ (f*g)(a) \right] k\!\left(\frac{n}{a}\right) \\
&= \sum_{a\mid n} \sum_{b\mid a} f(b)\, g\!\left(\frac{a}{b}\right) k\!\left(\frac{n}{a}\right) \\
&= \sum_{abc=n} f(a)\, g(b)\, k(c).
\end{aligned}
$$

设 $B(n) = (g*k)(n)$，同理

$$
\begin{aligned}
(f*B)(n)
&= \sum_{a\mid n} f(a)\, B\!\left(\frac{n}{a}\right) \\
&= \sum_{a\mid n} f(a) \sum_{b\mid n/a} g(b)\, k\!\left(\frac{n}{ab}\right) \\
&= \sum_{abc=n} f(a)\, g(b)\, k(c).
\end{aligned}
$$

两式相等，故 $(f*g)*k = f*(g*k)$。$\square$

---

## 定理 1

$$
  I(n)= \left[ \frac 1 n  \right]
$$

对于所有的数论函数，均有 $(f*I)(n)=f(n)$

**证明**：

$$
\begin{aligned}
   (f*I)(n) &= \sum_{a\mid n}f(a)\cdot I \left( \frac n a  \right) \\
   &= \sum_{a\mid n} f(a)\cdot  \left[ \frac a n  \right]\\
   &= \sum_{a\mid n}\left(f(a)\cdot \left[ \frac a n  \right]=\begin{cases}
      f(n)& a=n  \\[4pt]
      0& a<n
   \end{cases}\right) \\
   &= f(n) \quad \square
\end{aligned}
$$

---

## 定理 2

设 $f$ 是数论函数且 $f(1) \neq 0$。则存在唯一的数论函数 $f^{-1}$，称为 $f$ 的狄利克雷逆，使得

$$
(f * f^{-1})(n) = I(n),
$$

且

$$
f^{-1}(n) =
\begin{cases}
\dfrac{1}{f(1)}, & n = 1, \\[8pt]
-\dfrac{1}{f(1)} \displaystyle\sum_{\substack{d \mid n \\ d \neq n}}
f\!\left(\frac{n}{d}\right) f^{-1}(d), & n > 1.
\end{cases}
$$

## 证明

当 $n = 1$ 时，

$$
(f * f^{-1})(1) = f(1) f^{-1}(1) = I(1) = 1.
$$

由 $f(1) \neq 0$ 得 $f^{-1}(1) = 1/f(1)$，且这个值唯一。

假设结论对所有小于 $n$ 的正整数成立，下证对 $n$ 也成立。因为 $n > 1$ 时 $I(n) = 0$，

$$
\begin{aligned}
0
&= I(n) = (f * f^{-1})(n) \\
&= \sum_{d \mid n} f^{-1}(d) f\!\left(\frac{n}{d}\right) \\
&= \sum_{\substack{d \mid n \\ d \neq n}} f^{-1}(d) f\!\left(\frac{n}{d}\right)
   + f^{-1}(n) f(1).
\end{aligned}
$$

移项得

$$
f^{-1}(n) = -\frac{1}{f(1)}
\sum_{\substack{d \mid n \\ d \neq n}} f^{-1}(d) f\!\left(\frac{n}{d}\right). \qquad \square
$$

---

## 欧拉—莫比乌斯关系的卷积表述

以下两条恒等式是整个初等数论最核心的结论，用卷积写出来既简洁又便于推导：

$$
\boxed{\varphi * \mathbf{1} = \mathrm{id}} \qquad \qquad \boxed{\mu * \mathbf{1} = \varepsilon}
$$

**第一条的证明**：$(\varphi * \mathbf{1})(n) = \sum_{d \mid n} \varphi(d) = n = \mathrm{id}(n)$。

**第二条的证明**：$(\mu * \mathbf{1})(n) = \sum_{d \mid n} \mu(d) = [n = 1] = \varepsilon(n)$。

从这两条出发，可以流水般推出其他关系：

| 关系 | 推导 |
|:---|:---|
| $\varphi = \mu * \mathrm{id}$ | $\varphi = \varphi * \varepsilon = \varphi * (\mathbf{1} * \mu) = (\varphi * \mathbf{1}) * \mu = \mathrm{id} * \mu$ |
| $\mathrm{id} = \varphi * \mathbf{1}$ | 已证明 |
| $\mathbf{1} * \mu = \varepsilon$ | 已证明 |
| $\varphi(n) = n \sum_{d \mid n} \frac{\mu(d)}{d}$ | $\varphi = \mu * \mathrm{id}$ 展开即得 |
