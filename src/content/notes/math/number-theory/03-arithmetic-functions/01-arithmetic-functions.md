---
title: '§3.1 数论函数 $v_p(n)$'
description: "用 p 进制的视角，理解阶乘与整除。"
subject: math
course: number-theory
chapter: 03-arithmetic-functions
order: 1
updated: 2026-06-08
tags: [数论, 数论函数]
featured: false
---
> 上课用的是 $\operatorname{pot}_p(n)$，这里统一写成更常见的 $v_p(n)$，两者含义相同。

## 定义

给定素数 $p$，若 $p^m \parallel n$，即 $p^m \mid n$ 且 $p^{m+1} \nmid n$，则记

$$
v_p(n) = m.
$$

对有理数 $a/b$，定义

$$
v_p\!\left(\frac{a}{b}\right) = v_p(a) - v_p(b).
$$

## 基本性质

1. $v_p(mn) = v_p(m) + v_p(n)$；
2. $v_p(n^k) = k\,v_p(n)$。

**例子**：

$$
\begin{aligned}
v_3(54)
&= v_3(3^3 \times 2) \\
&= v_3(3^3) + v_3(2) \\
&= 3v_3(3) + 0 \\
&= 3.
\end{aligned}
$$

## 定理 1

设 $p$ 是素数，$p^k \leqslant n < p^{k+1}$，则

$$
v_p(n!) = \left\lfloor \frac{n}{p} \right\rfloor
+ \left\lfloor \frac{n}{p^2} \right\rfloor
+ \cdots
+ \left\lfloor \frac{n}{p^k} \right\rfloor
= \sum_{i=1}^{k} \left\lfloor \frac{n}{p^i} \right\rfloor.
$$

### 证明

由 $v_p$ 的可加性，

$$
v_p(n!) = \sum_{j=1}^{n} v_p(j).
$$

在 $1 \sim n$ 中，只有 $p$ 的倍数对和有贡献，这样的数共有 $\lfloor n/p \rfloor$ 个。把每个 $pj$ 写成 $p \cdot j$，得

$$
\begin{aligned}
v_p(n!)
&= \sum_{j=1}^{\lfloor n/p \rfloor} v_p(pj) \\
&= \sum_{j=1}^{\lfloor n/p \rfloor} \bigl(v_p(j) + 1\bigr) \\
&= v_p\!\left(\left\lfloor \frac{n}{p} \right\rfloor !\right) + \left\lfloor \frac{n}{p} \right\rfloor.
\end{aligned}
$$

对 $\lfloor n/p \rfloor!$ 重复同样的操作。因为

$$
\left\lfloor \frac{\lfloor n/p \rfloor}{p} \right\rfloor
= \left\lfloor \frac{n}{p^2} \right\rfloor,
$$

所以

$$
v_p(n!) = \left\lfloor \frac{n}{p} \right\rfloor
+ \left\lfloor \frac{n}{p^2} \right\rfloor
+ v_p\!\left(\left\lfloor \frac{n}{p^2} \right\rfloor !\right).
$$

继续下去，直到 $p^k \leqslant n < p^{k+1}$，此时 $\lfloor n/p^{k+1} \rfloor = 0$，于是

$$
v_p(n!) = \sum_{i=1}^{k} \left\lfloor \frac{n}{p^i} \right\rfloor. \qquad \square
$$

> **推论**：
> $$
> n! = \prod_{i=1}^{s} p_i^{a_i}
> = \prod_{i=1}^{s} p_i^{\sum_{j \geqslant 1} \lfloor n/p_i^j \rfloor}.
> $$

## 定理 2

设 $0 < r < n$，则

$$
\binom{n}{r} = \frac{n!}{r!\,(n-r)!}
$$

是整数。

### 证明

设

$$
n! = \prod_{i=1}^{s} p_i^{a_i}, \qquad
r! = \prod_{i=1}^{s} p_i^{b_i}, \qquad
(n-r)! = \prod_{i=1}^{s} p_i^{c_i},
$$

其中 $a_i,b_i,c_i \geqslant 0$。由定理 1，

$$
a_i = \sum_{j \geqslant 1} \left\lfloor \frac{n}{p_i^j} \right\rfloor, \quad
b_i = \sum_{j \geqslant 1} \left\lfloor \frac{r}{p_i^j} \right\rfloor, \quad
c_i = \sum_{j \geqslant 1} \left\lfloor \frac{n-r}{p_i^j} \right\rfloor.
$$

对每个 $j$，由 $n = r + (n-r)$ 及 $\lfloor x+y \rfloor \geqslant \lfloor x \rfloor + \lfloor y \rfloor$，有

$$
\left\lfloor \frac{n}{p_i^j} \right\rfloor
\geqslant
\left\lfloor \frac{r}{p_i^j} \right\rfloor
+ \left\lfloor \frac{n-r}{p_i^j} \right\rfloor.
$$

对 $j$ 求和得 $a_i \geqslant b_i + c_i$。因此分母的每个素因子幂次都不超过分子，故

$$
\binom{n}{r} = \frac{n!}{r!\,(n-r)!}
$$

是整数。$\square$
