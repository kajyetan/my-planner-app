'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import ProgressSummaryTable from './ProgressSummaryTable';

const TwelveWeekPlanner = () => {
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [weeks, setWeeks] = useState(Array(12).fill().map(() => ({
    goal: '',
    days: Array(7).fill().map(() => ({ items: [] }))
  })));

  const handlePrimaryGoalChange = (e) => setPrimaryGoal(e.target.value);

  const handleWeekGoalChange = (weekIndex, e) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].goal = e.target.value;
    setWeeks(newWeeks);
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">12 Week Year Planner</h1>
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
            {week.days.map((day, dayIndex) => (
              <div key={dayIndex} className="mb-2">
                <h3 className="font-semibold">Day {dayIndex + 1}</h3>
                <ul>
                  {day.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center mb-1">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleDailyItem(weekIndex, dayIndex, itemIndex)}
                      />
                      <span className={`ml-2 ${item.completed ? 'line-through' : ''}`}>
                        {item.text}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteDailyItem(weekIndex, dayIndex, itemIndex)}
                        className="ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="flex mt-1">
                  <Input
                    placeholder="Add new item"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim() !== '') {
                        addDailyItem(weekIndex, dayIndex, e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                    className="mr-2"
                  />
                  <Button
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      if (input.value.trim() !== '') {
                        addDailyItem(weekIndex, dayIndex, input.value.trim());
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
		<ProgressSummaryTable weeks={weeks} />
    </div>
  );
};
export default TwelveWeekPlanner;