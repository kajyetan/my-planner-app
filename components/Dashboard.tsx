'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import TwelveWeekPlanner from './TwelveWeekPlanner';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Dashboard = () => {
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const storedPlans = localStorage.getItem('plans');
    if (storedPlans) {
      const parsedPlans = JSON.parse(storedPlans);
      setPlans(parsedPlans);
      setActiveTab(parsedPlans[0]?.id || '');
    } else {
      const defaultPlan = {
        id: '1',
        name: 'Plan 1',
        data: {
          primaryGoal: '',
          weeks: Array(12).fill().map(() => ({
            goal: '',
            days: weekdays.map(day => ({ name: day, items: [] }))
          }))
        }
      };
      setPlans([defaultPlan]);
      setActiveTab('1');
      localStorage.setItem('plans', JSON.stringify([defaultPlan]));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('plans', JSON.stringify(plans));
  }, [plans]);

  const handleAddPlan = () => {
    const newPlan = {
      id: (plans.length + 1).toString(),
      name: `Plan ${plans.length + 1}`,
      data: {
        primaryGoal: '',
        weeks: Array(12).fill().map(() => ({
          goal: '',
          days: weekdays.map(day => ({ name: day, items: [] }))
        }))
      }
    };
    setPlans([...plans, newPlan]);
    setActiveTab(newPlan.id);
  };

  const handleUpdatePlan = (planId, newData) => {
    const updatedPlans = plans.map(plan => 
      plan.id === planId ? { ...plan, data: newData } : plan
    );
    setPlans(updatedPlans);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">12 Week Year Planner Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center mb-4">
          <TabsList>
            {plans.map((plan) => (
              <TabsTrigger key={plan.id} value={plan.id}>
                {plan.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button variant="outline" className="ml-4" onClick={handleAddPlan}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Plan
          </Button>
        </div>
        {plans.map((plan) => (
          <TabsContent key={plan.id} value={plan.id}>
            <TwelveWeekPlanner 
              planId={plan.id} 
              planData={plan.data} 
              onUpdatePlan={(newData) => handleUpdatePlan(plan.id, newData)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Dashboard;