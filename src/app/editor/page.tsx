'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CandidateCard from '@/components/editor/CandidateCard';
import Loading from '@/components/ui/Loading';
import { getTodayDateString } from '@/lib/utils/date';
import { useRouter } from 'next/navigation';

export default function EditorDashboard() {
  return (
    <ProtectedRoute requireEditor>
      <EditorContent />
    </ProtectedRoute>
  );
}

function EditorContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

  useEffect(() => {
    loadTodaysCandidates();
  }, []);

  const loadTodaysCandidates = async () => {
    const today = getTodayDateString();

    try {
      const response = await fetch(`/api/candidates/${today}`);
      const data = await response.json();

      if (data.success) {
        setCandidates(data.candidates || []);
        setSelectedCandidate(data.selectedCandidate);
      }
    } catch (error) {
      console.error('Failed to load candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectCandidate = async (candidateNum: number) => {
    setLoading(true);

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate: candidates[candidateNum - 1],
          storyId: getTodayDateString(),
        }),
      });

      if (response.ok) {
        router.push('/editor/review');
      }
    } catch (error) {
      console.error('Failed to select candidate:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-white">Today&apos;s Story Candidates</h1>
        <p className="text-white/60 mt-2">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </header>

      {selectedCandidate ? (
        <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-8">
          <p className="text-white">
            ✓ Candidate {selectedCandidate} selected. Story is being generated.
          </p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8">
          <p className="text-white/80">
            ⚠️ No story selected yet. Auto-select happens at 8:50 AM if no manual selection.
          </p>
        </div>
      )}

      <div className="grid gap-6">
        {candidates.map((candidate: any) => (
          <CandidateCard
            key={candidate.candidateNum}
            candidate={candidate}
            onSelect={() => selectCandidate(candidate.candidateNum)}
            disabled={selectedCandidate !== null}
          />
        ))}
      </div>
    </div>
  );
}
