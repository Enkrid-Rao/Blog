---
title: '§3.3 欧拉函数 $\varphi(n)$'
description: "1 到 n 之间，与 n 互质的数有多少个。"
subject: math
course: number-theory
chapter: 03-arithmetic-functions
order: 3
updated: 2026-06-08
tags: [数论, 数论函数]
featured: false
---
## 定义

$\varphi(n)$ 表示 $1 \sim n$ 中与 $n$ 互质的正整数个数，即

$$
\varphi(n) = \sum_{\substack{1 \leqslant k \leqslant n \\ \gcd(k, n) = 1}} 1.
$$

约定 $\varphi(1) = 1$。

## 基本性质

### (a) 素数

若 $p$ 是素数，则

$$
\varphi(p) = p - 1.
$$

因为 $1 \sim p$ 中除了 $p$ 自身，其余 $p - 1$ 个数都与 $p$ 互质。

### (b) 素数幂

若 $p$ 是素数，则

$$
\varphi(p^k) = p^k - p^{k-1} = p^k \left(1 - \frac{1}{p}\right).
$$

因为 $1 \sim p^k$ 中与 $p^k$ 不互质的数恰好是 $p$ 的倍数，共有 $p^{k-1}$ 个。

## 计算公式

设 $n = p_1^{\alpha_1} p_2^{\alpha_2} \cdots p_r^{\alpha_r}$ 为标准分解，则

$$
\varphi(n) = n \prod_{i=1}^{r} \left(1 - \frac{1}{p_i}\right).
$$

**证明（容斥原理）**：在 $1 \sim n$ 中，先去掉所有 $p_1$ 的倍数，再去掉所有 $p_2$ 的倍数，再把被重复去掉的 $p_1p_2$ 的倍数加回来。依此类推，得到

$$
\begin{aligned}
\varphi(n)
&= n - \sum_{i} \frac{n}{p_i} + \sum_{i < j} \frac{n}{p_i p_j} - \sum_{i < j < k} \frac{n}{p_i p_j p_k} + \cdots \\
&= n \left( 1 - \sum_{i} \frac{1}{p_i} + \sum_{i < j} \frac{1}{p_i p_j} - \cdots \right) \\
&= n \prod_{i=1}^{r} \left(1 - \frac{1}{p_i}\right).
\end{aligned}
$$

最后一步用了展开式 $\prod_i (1 - x_i) = 1 - \sum_i x_i + \sum_{i<j} x_i x_j - \cdots$。

---

## 定理 1

对任意 $n \geqslant 1$，有

$$
\sum_{d \mid n} \varphi(d) = n.
$$

### 思路

考虑集合

$$
S = \left\{\frac{i}{n} \,\middle|\, 1 \leqslant i \leqslant n\right\},
$$

则 $|S| = n$。对每个 $d \mid n$，令

$$
S_d = \left\{\frac{i}{d} \,\middle|\, 1 \leqslant i \leqslant d,\ \gcd(i,d) = 1\right\},
$$

则 $|S_d| = \varphi(d)$。只需证明 $\{S_d\}_{d \mid n}$ 构成 $S$ 的一个划分。

### 证明

**（1）两两不交。** 设 $d, d' \mid n$ 且 $d \neq d'$。若存在 $a \in S_d \cap S_{d'}$，则

$$
a = \frac{i}{d} = \frac{i'}{d'}, \qquad 1 \leqslant i \leqslant d,\ 1 \leqslant i' \leqslant d',
$$

且 $\gcd(i,d) = \gcd(i',d') = 1$。由 $id' = i'd$ 得 $d \mid id'$；又因为 $\gcd(i,d) = 1$，所以 $d \mid d'$。同理 $d' \mid d$，于是 $d = d'$，矛盾。因此 $S_d \cap S_{d'} = \varnothing$。

**（2）并集包含于 $S$。** 任取 $a \in \bigcup_{d \mid n} S_d$，存在 $d \mid n$ 使 $a = i/d$，其中 $1 \leqslant i \leqslant d$ 且 $\gcd(i,d) = 1$。由 $d \mid n$，

$$
a = \frac{i}{d} = \frac{i \cdot (n/d)}{n},
$$

且 $1 \leqslant i \cdot (n/d) \leqslant n$，故 $a \in S$。

**（3）$S$ 包含于并集。** 任取 $a \in S$，写 $a = i/n$，其中 $1 \leqslant i \leqslant n$。令 $d = \gcd(i,n)$，则

$$
a = \frac{i/d}{n/d}, \qquad 1 \leqslant \frac{i}{d} \leqslant \frac{n}{d}, \qquad \gcd\left(\frac{i}{d}, \frac{n}{d}\right) = 1,
$$

故 $a \in S_{n/d}$。因此 $S \subset \bigcup_{d \mid n} S_d$。

综上，$S = \bigsqcup_{d \mid n} S_d$，于是

$$
\sum_{d \mid n} \varphi(d) = |S| = n. \qquad \square
$$

---

## 引理

设 $\gcd(m,n) = 1$。若 $t_1$ 遍历 $n$ 的全部因子，$t_2$ 遍历 $m$ 的全部因子，则 $t_1t_2$ 遍历 $mn$ 的全部因子。

### 证明

**第一步：$t_1t_2 \mid mn$。** 由 $t_1 \mid m$、$t_2 \mid n$，立即得到 $t_1t_2 \mid mn$。

**第二步：表示唯一。** 证明 $t_1t_2 = t_1't_2'$ 当且仅当 $t_1 = t_1'$、$t_2 = t_2'$。

假设 $t_1t_2 = t_1't_2'$ 且 $(t_1,t_2) \neq (t_1',t_2')$。由

$$
t_1 \mid t_1't_2', \qquad t_1' \mid t_1t_2
$$

以及 $\gcd(m,n)=1$，可得 $\gcd(t_1,t_2') = 1$。于是 $t_1 \mid t_1'$；同理 $t_1' \mid t_1$，故 $t_1 = t_1'$，进而 $t_2 = t_2'$，与假设矛盾。

**第三步：遍历全部因子。** 任取 $t \mid mn$，令

$$
t_1 = \gcd(t,m), \qquad t_2 = \frac{t}{t_1}.
$$

则 $t_1 \mid m$。又

$$
\gcd\left(\frac{t}{\gcd(t,m)}, \frac{m}{\gcd(t,m)}\right) = 1,
$$

且 $t/t_1 \mid n$，所以 $t_2 \mid n$。因此每个 $t \mid mn$ 都能写成 $t_1t_2$ 的形式。

结合三步，引理得证。$\square$

---

## 积性（定理 2）

若 $\gcd(m,n) = 1$，则

$$
\varphi(mn) = \varphi(m)\varphi(n).
$$

### 法一：直接展开

设 $m = \prod_i p_i^{\alpha_i}$，$n = \prod_j q_j^{\beta_j}$。由 $\gcd(m,n)=1$ 知 $\{p_i\}$ 与 $\{q_j\}$ 不相交。于是

$$
\begin{aligned}
\varphi(mn)
&= mn \prod_{p \mid mn} \left(1 - \frac{1}{p}\right) \\
&= mn \left( \prod_{p_i \mid m} \left(1 - \frac{1}{p_i}\right) \right)
      \left( \prod_{q_j \mid n} \left(1 - \frac{1}{q_j}\right) \right) \\
&= \left[ m \prod_{p_i \mid m} \left(1 - \frac{1}{p_i}\right) \right]
   \cdot \left[ n \prod_{q_j \mid n} \left(1 - \frac{1}{q_j}\right) \right] \\
&= \varphi(m)\varphi(n). \qquad \square
\end{aligned}
$$

### 法二：数学归纳

当 $m=n=1$ 时结论显然。假设结论对所有小于 $mn$ 的正整数成立。由定理 1，

$$
mn = \sum_{t_1 \mid m} \varphi(t_1) \sum_{t_2 \mid n} \varphi(t_2)
   = \sum_{t_1 \mid m} \sum_{t_2 \mid n} \varphi(t_1)\varphi(t_2).
$$

因为 $\gcd(m,n)=1$，所以 $\gcd(t_1,t_2)=1$，从而 $\varphi(t_1)\varphi(t_2) = \varphi(t_1t_2)$。于是

$$
\begin{aligned}
mn
&= \sum_{\substack{t_1 \mid m,\ t_2 \mid n \\ (t_1,t_2) \neq (m,n)}} \varphi(t_1t_2) + \varphi(m)\varphi(n) \\
&= \sum_{t_1 \mid m,\ t_2 \mid n} \varphi(t_1t_2) - \varphi(mn) + \varphi(m)\varphi(n) \\
&= \sum_{t_1t_2 \mid mn} \varphi(t_1t_2) - \varphi(mn) + \varphi(m)\varphi(n) \\
&= mn - \varphi(mn) + \varphi(m)\varphi(n),
\end{aligned}
$$

最后一步再次使用定理 1。因此 $\varphi(mn) = \varphi(m)\varphi(n)$。$\square$

> **推论**：由积性，
> $$
> \varphi(n) = \prod_{i=1}^{r} \varphi(p_i^{\alpha_i})
> = \prod_{i=1}^{r} p_i^{\alpha_i-1}(p_i - 1).
> $$

---

## 定理 3

设 $\gcd(m,n) = d$，则

$$
\varphi(mn) = \varphi(m)\varphi(n)\frac{d}{\varphi(d)}.
$$

若 $a \mid b$，则 $\varphi(a) \mid \varphi(b)$。

### 证明

**（1）** 令 $\gcd(m,n)=d$。则

$$
\begin{aligned}
\varphi(mn)
&= mn \prod_{p \mid mn} \left(1-\frac{1}{p}\right) \\
&= mn \cdot
   \frac{\displaystyle\prod_{p \mid m} \left(1-\frac{1}{p}\right)
         \prod_{p \mid n} \left(1-\frac{1}{p}\right)}
        {\displaystyle\prod_{p \mid d} \left(1-\frac{1}{p}\right)} \\
&= \frac{m \displaystyle\prod_{p \mid m} \left(1-\frac{1}{p}\right)
         \cdot n \displaystyle\prod_{p \mid n} \left(1-\frac{1}{p}\right) \cdot d}
        {d \cdot \displaystyle\prod_{p \mid d} \left(1-\frac{1}{p}\right)} \\
&= \varphi(m)\varphi(n)\frac{d}{\varphi(d)}. \qquad \square
\end{aligned}
$$

**（2）** 设 $b = ac$，并令 $d = \gcd(a,c)$。由（1），

$$
\begin{aligned}
\varphi(b)
&= \varphi(ac) \\
&= \varphi(a)\varphi(c)\frac{d}{\varphi(d)} \\
&= \varphi(a) \cdot
   \frac{c \displaystyle\prod_{p \mid c} \left(1-\frac{1}{p}\right)}
        {\displaystyle\prod_{p \mid d} \left(1-\frac{1}{p}\right)} \\
&= \varphi(a) \cdot c \prod_{\substack{p \mid c \\ p \nmid d}} \left(1-\frac{1}{p}\right).
\end{aligned}
$$

其中最后一步约去了 $p \mid d$ 的因子。将 $c$ 按素因子拆开：

$$
c \prod_{\substack{p \mid c \\ p \nmid d}} \left(1-\frac{1}{p}\right)
= \prod_{\substack{p \mid c \\ p \mid d}} p^{v_p(c)}
  \cdot \prod_{\substack{p \mid c \\ p \nmid d}} \left(p^{v_p(c)} - p^{v_p(c)-1}\right).
$$

右边是整数，故 $\varphi(a) \mid \varphi(b)$。$\square$
