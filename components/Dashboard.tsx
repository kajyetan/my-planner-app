'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import TwelveWeekPlanner from './TwelveWeekPlanner';

const Dashboard = () => {
  const [plans, setPlans] = useState([
    { id: '1', name: 'Plan 1', data: {} },
  ]);
  const [activeTab, setActiveTab] = useState('1');

  const handleAddPlan = () => {
    const newPlan = {
      id: (plans.length + 1).toString(),
      name: `Plan ${plans.length + 1}`,
      data: {},
    };
    setPlans([...plans, newPlan]);
    setActiveTab(newPlan.id);
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
            <TwelveWeekPlanner planId={plan.id} planData={plan.data} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Dashboard;