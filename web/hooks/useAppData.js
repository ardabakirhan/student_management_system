import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "../src/services/api";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [data, setData] = useState(() => api.getStoredState());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    api.getAppState().then((snapshot) => {
      if (isMounted) {
        setData(snapshot);
        setIsReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Re-fetchable without resetting isReady (used after login).
  const refresh = useCallback(async () => {
    const snapshot = await api.getAppState();
    setData(snapshot);
  }, []);

  const syncState = async (promise) => {
    await promise;
    const nextState = await api.getAppState();
    setData(nextState);
    return nextState;
  };

  const markPaymentPaid = async (paymentId) => syncState(api.markPaymentPaid(paymentId));
  const addUser = async (user) => syncState(api.createUser(user));
  const deleteUser = async (userId) => syncState(api.deleteUser(userId));
  const createStudent = async (payload) => syncState(api.createStudent(payload));
  const updateStudent = async (id, fields) => syncState(api.updateStudent(id, fields));
  const deleteStudent = async (studentId) => syncState(api.deleteStudent(studentId));
  const markAttendancePresent = async (attendanceId) => syncState(api.markAttendancePresent(attendanceId));
  const createInvoice = async (payload) => syncState(api.createInvoice(payload));
  const createEvaluation = async (payload) => syncState(api.createEvaluation(payload));
  const sendMessage = async (payload) => syncState(api.sendMessage(payload));
  const markMessageRead = async (messageId) => syncState(api.markMessageRead(messageId));
  const createDemoRequest = async (payload) => syncState(api.createDemoRequest(payload));
  const createAnnouncement = async (payload) => syncState(api.createAnnouncement(payload));
  const addScheduleEntry = async (payload) => syncState(api.addScheduleEntry(payload));
  const deleteScheduleEntry = async (id) => syncState(api.deleteScheduleEntry(id));

  return (
    <AppDataContext.Provider
      value={{
        data,
        isReady,
        refresh,
        markPaymentPaid,
        markAttendancePresent,
        addUser,
        deleteUser,
        createStudent,
        updateStudent,
        deleteStudent,
        createInvoice,
        createEvaluation,
        sendMessage,
        markMessageRead,
        createDemoRequest,
        createAnnouncement,
        addScheduleEntry,
        deleteScheduleEntry
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }

  return context;
}