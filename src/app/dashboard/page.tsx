"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersTable from "@/components/dashboard/table/users-table";
import ArtistsTable from "@/components/dashboard/table/artist-table";

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [initialPage, setInitialPage] = useState(1);
  const [initialLimit, setInitialLimit] = useState(5);
  const [search, setSearch] = useState("");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setInitialPage(1);
    setInitialLimit(5);
    setSearch("");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto mt-8">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersTable
              initialPage={initialPage}
              initialLimit={initialLimit}
              initialSearch={search}
              // setSearch={setSearch}
            />
          </TabsContent>
          <TabsContent value="artists">
            <ArtistsTable
              initialPage={initialPage}
              initialLimit={initialLimit}
              initialSearch={search}
              setSearch={setSearch}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
