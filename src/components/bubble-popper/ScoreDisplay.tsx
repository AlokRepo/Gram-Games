"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  highScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, highScore }) => {
  return (
    <div className="flex gap-4">
      <Card className="text-center shadow-md w-36">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg font-semibold text-primary-foreground bg-primary py-1 px-2 rounded-md inline-block">Score</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-4xl font-bold text-foreground">{score}</p>
        </CardContent>
      </Card>
       <Card className="text-center shadow-md w-36">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg font-semibold text-accent-foreground bg-accent py-1 px-2 rounded-md inline-block">
            <Award className="inline-block mr-1 h-5 w-5" />
            Best
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-4xl font-bold text-foreground">{highScore}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreDisplay;
