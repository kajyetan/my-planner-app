'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import TwelveWeekPlanner from './TwelveWeekPlanner';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Dashboard = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:3001/plans');
        setPlans(response.data);
        setActiveTab(response.data[0]?.id || '');
      } catch (err) {
        console.error('Error fetching plans:', err);
      }
    };
    
    fetchPlans();
  }, []);

  // Debounced function for updating plans
  const debouncedUpdatePlans = useCallback(debounce((updatedPlans: any[]) => {
    setPlans(updatedPlans);
    localStorage.setItem('plans', JSON.stringify(updatedPlans));
  }, 500), []); // Adjust the delay 

  const handleAddPlan = async () => {
    const newPlan = {
      id: (plans.length + 1).toString(),
      name: `Plan ${plans.length + 1}`,
      data: {
        primaryGoal: '',
        weeks: Array(12).fill({
          goal: '',
          days: weekdays.map(day => ({ name: day, items: [] }))
        })
      }
    };
    
    try {
      const response = await axios.post('http://localhost:3001/plans', newPlan);
      setPlans(prevPlans => [...prevPlans, response.data]);
      setActiveTab(response.data.id.toString());
    } catch (err) {
      console.error('Error adding plan:', err);
    }
  };

  const handleUpdatePlan = (planId: string, newData: any) => {
    const updatedPlans = plans.map(plan => 
      plan.id === planId ? { ...plan, data: newData } : plan
    );
    debouncedUpdatePlans(updatedPlans);
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