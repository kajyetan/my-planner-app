'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const ProgressSummaryTable = ({ weeks }) => {
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateWeeklyProgress = (week) => {
      const totalItems = week.days.reduce((sum, day) => sum + day.items.length, 0);
      const completedItems = week.days.reduce((sum, day) => sum + day.items.filter(item => item.completed).length, 0);
      return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    };

    const calculatedWeeklyProgress = weeks.map(week => calculateWeeklyProgress(week));
    setWeeklyProgress(calculatedWeeklyProgress);

    const calculatedOverallProgress = calculatedWeeklyProgress.reduce((sum, progress) => sum + progress, 0) / weeks.length;
    setOverallProgress(calculatedOverallProgress);

    setIsLoading(false);
  }, [weeks]);

  if (isLoading) {
    return <div>Loading progress summary...</div>;
  }

  return (
    <Card className="mt-8">
      <CardHeader>Progress Summary</CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Week</th>
                <th className="py-2 px-4 text-left">Daily Goals Completed</th>
              </tr>
            </thead>
            <tbody>
              {weeklyProgress.map((progress, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">Week {index + 1}</td>
                  <td className="py-2 px-4">{progress.toFixed(2)}%</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="py-2 px-4">Overall Progress</td>
                <td className="py-2 px-4">{overallProgress.toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressSummaryTable;