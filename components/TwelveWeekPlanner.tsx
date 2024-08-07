'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import ProgressSummaryTable from './ProgressSummaryTable';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface Day {
  name: string;
  items: { text: string; completed: boolean }[];
}

interface Week {
  goal: string;
  days: Day[];
}

interface PlanData {
  primaryGoal: string;
  weeks: Week[];
}

interface TwelveWeekPlannerProps {
  planId: number;
  planData: PlanData;
  onUpdatePlan: (newData: PlanData) => void;
}

const TwelveWeekPlanner: React.FC<TwelveWeekPlannerProps> = ({ planId, planData, onUpdatePlan }) => {
  const [primaryGoal, setPrimaryGoal] = useState(planData.primaryGoal || '');
  const [weeks, setWeeks] = useState(planData.weeks || Array(12).fill({
    goal: '',
    days: weekdays.map(day => ({ name: day, items: [] }))
  }));
  const [newItems, setNewItems] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setPrimaryGoal(planData.primaryGoal || '');
    setWeeks(planData.weeks || Array(12).fill({
      goal: '',
      days: weekdays.map(day => ({ name: day, items: [] }))
    }));
  }, [planData]);

  const updatePlanData = () => {
    onUpdatePlan({ primaryGoal, weeks });
  };

  const handlePrimaryGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryGoal(e.target.value);
    updatePlanData();
  };

  const handleWeekGoalChange = (weekIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].goal = e.target.value;
    setWeeks(newWeeks);
    updatePlanData();
  };

  const addDailyItem = (weekIndex: number, dayIndex: number, item: string) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].items.push({ text: item, completed: false });
    setWeeks(newWeeks);
    setNewItems({ ...newItems, [`${weekIndex}-${dayIndex}`]: '' });
    updatePlanData();
  };

  const toggleDailyItem = (weekIndex: number, dayIndex: number, itemIndex: number) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].items[itemIndex].completed = 
      !newWeeks[weekIndex].days[dayIndex].items[itemIndex].completed;
    setWeeks(newWeeks);
    updatePlanData();
  };

  const deleteDailyItem = (weekIndex: number, dayIndex: number, itemIndex: number) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].items.splice(itemIndex, 1);
    setWeeks(newWeeks);
    updatePlanData();
  };

  const handleNewItemChange = (weekIndex: number, dayIndex: number, value: string) => {
    setNewItems({ ...newItems, [`${weekIndex}-${dayIndex}`]: value });
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
            {week.days.map((day, dayIndex) => (
              <div key={dayIndex} className="mb-2">
                <h3 className="font-semibold">{day.name}</h3>
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
                    value={newItems[`${weekIndex}-${dayIndex}`] || ''}
                    placeholder="Add new item"
                    onChange={(e) => handleNewItemChange(weekIndex, dayIndex, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                        addDailyItem(weekIndex, dayIndex, e.currentTarget.value.trim());
                      }
                    }}
                    className="mr-2"
                  />
                  <Button
                    onClick={() => {
                      const value = newItems[`${weekIndex}-${dayIndex}`]?.trim();
                      if (value) {
                        addDailyItem(weekIndex, dayIndex, value);
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
