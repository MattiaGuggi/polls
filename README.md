# 🏆 Elo Polls & Bracket Tournament App

A Next.js application for running dynamic, head-to-head bracket polls. Participants face off in 1v1 matchups, updating their **Elo ratings ($K=32$)** in real time until a single winner emerges and full leaderboards are compiled.

---

## 🚀 Features

* **Pairwise Voting Engine**: Compares participants head-to-head in round-robin or single-elimination tournament style.
* **Real-Time Elo Rating Calculations**: Uses standard Elo formulas to update player ratings and expected win rates after every matchup.
* **GSAP-Powered Animations**: Smooth entrance animations using GSAP and ScrollTrigger via `<AnimatedContent>`.
* **Protected Routes & Authentication**: Client-side authentication context (`UserContext`) enforcing route protection.
* **Dynamic Fallback Avatars**: Automatically generates deterministic SVG avatars using the DiceBear API if no image URL is provided.
* **Responsive Dark UI**: Styled with Tailwind CSS, glowing background gradients, and Lucide React icons.

---

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router, Client Components) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Animations** | [GSAP](https://gsap.com/) & ScrollTrigger |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Icons & Avatars** | [Lucide React](https://lucide.dev/), [DiceBear API](https://www.dicebear.com/) |

---

## 📁 Project Structure

```text
├── app/
│   ├── (protected)/        # Protected layout wrapper
│   │   └── layout.tsx
│   ├── api/
│   │   └── polls/          # API route handlers
│   │       ├── get/
│   │       ├── get-all/
│   │       └── update/
│   ├── components/
│   │   └── AnimatedContent.tsx  # GSAP animation component
│   ├── context/
│   │   └── UserContext.tsx      # Auth state management
│   ├── poll/
│   │   └── [id]/           # Poll matchup and game logic
│   ├── lib/
│   │   └── types.ts        # TypeScript definitions
│   ├── page.tsx            # Home dashboard
│   └── layout.tsx