"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersTable from "@/components/dashboard/users-table";
import ArtistsContent from "@/components/dashboard/artist-table";

const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-44">
      <div className="w-full max-w-4xl">
        <Tabs defaultValue="users" className="w-full flex-col flex gap-20">
          <TabsList className="justify-center w-96">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <UsersTable />
          </TabsContent>
          <TabsContent value="artists">
            <ArtistsContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
