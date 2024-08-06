'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import ProgressSummaryTable from './ProgressSummaryTable';

const TwelveWeekPlanner = ({ planId, planData }) => {
  const [primaryGoal, setPrimaryGoal] = useState(planData.primaryGoal || '');
  const [weeks, setWeeks] = useState(planData.weeks || Array(12).fill().map(() => ({
    goal: '',
    days: Array(7).fill().map(() => ({ items: [] }))
  })));

  useEffect(() => {
    // Update local state when planData changes
    setPrimaryGoal(planData.primaryGoal || '');
    setWeeks(planData.weeks || Array(12).fill().map(() => ({
      goal: '',
      days: Array(7).fill().map(() => ({ items: [] }))
    })));
  }, [planData]);

  const handlePrimaryGoalChange = (e) => {
    setPrimaryGoal(e.target.value);
    // TODO: Update plan data in parent component or database
  };

  const handleWeekGoalChange = (weekIndex, e) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].goal = e.target.value;
    setWeeks(newWeeks);
    // TODO: Update plan data in parent component or database
  };


  const addDailyItem = (weekIndex, dayIndex, item) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].items.push({ text: item, completed: false });
    setWeeks(newWeeks);
  };

  const toggleDailyItem = (weekIndex, dayIndex, itemIndex) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].items[itemIndex].completed = 
      !newWeeks[weekIndex].days[dayIndex].items[itemIndex].completed;
    setWeeks(newWeeks);
  };

  const deleteDailyItem = (weekIndex, dayIndex, itemIndex) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].items.splice(itemIndex, 1);
    setWeeks(newWeeks);
  };

   return (
    <div>
      <Card className="mb-4">
        <CardHeader>Primary Goal</CardHeader>
        <CardContent>
          <Input
            value={primaryGoal}
            onChange={handlePrimaryGoalChange}
            placeholder="Enter your primary goal"
          />
        </CardContent>
      </Card>
      {weeks.map((week, weekIndex) => (
        <Card key={weekIndex} className="mb-4">
          <CardHeader>Week {weekIndex + 1}</CardHeader>
          <CardContent>
            <Input
              value={week.goal}
              onChange={(e) => handleWeekGoalChange(weekIndex, e)}
              placeholder={`Enter goal for Week ${weekIndex + 1}`}
              className="mb-2"
            />
            {/* ... day and item rendering ... */}
          </CardContent>
        </Card>
      ))}
      <ProgressSummaryTable weeks={weeks} />
    </div>
  );
};

export default TwelveWeekPlanner;