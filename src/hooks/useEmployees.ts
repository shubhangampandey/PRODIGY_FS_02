import { useState, useEffect, useCallback } from "react";
import { Employee } from "@/types/employee";
import { api } from "@/lib/api";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getEmployees();
      // Map MongoDB _id to id for frontend compatibility
      setEmployees(data.map((e: any) => ({ ...e, id: e._id || e.id })));
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const addEmployee = async (data: Omit<Employee, "id">) => {
    const created = await api.createEmployee(data as Record<string, unknown>);
    const newEmp = { ...created, id: created._id || created.id };
    setEmployees((prev) => [newEmp, ...prev]);
    return newEmp;
  };

  const updateEmployee = async (id: string, data: Partial<Employee>) => {
    const updated = await api.updateEmployee(id, data as Record<string, unknown>);
    const updatedEmp = { ...updated, id: updated._id || updated.id };
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? updatedEmp : emp)));
  };

  const deleteEmployee = async (id: string) => {
    await api.deleteEmployee(id);
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const getEmployee = (id: string) => employees.find((emp) => emp.id === id);

  return { employees, loading, addEmployee, updateEmployee, deleteEmployee, getEmployee, refetch: fetchEmployees };
};
