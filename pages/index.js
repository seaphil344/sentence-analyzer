import SentenceWordAnalyzer from "@/components/SentenceWordAnalyzer";
import WordGuesser from "@/components/WordGuesser";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SentenceWordAnalyzer />
      <WordGuesser />
    </main>
  );
}
