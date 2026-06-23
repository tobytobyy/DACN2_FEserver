import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { WaterProvider, useWater } from '../../context/WaterContext';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(WaterProvider, null, children);

describe('WaterContext - initializeForDay', () => {
  it('initializes currentIntake from server value', async () => {
    const { result } = await renderHook(() => useWater(), { wrapper });
    expect(result.current.currentIntake).toBe(0);

    await act(async () => {
      result.current.initializeForDay(1500);
    });

    await waitFor(() => {
      expect(result.current.currentIntake).toBe(1500);
    });
  });

  it('does not re-initialize if already called (idempotent)', async () => {
    const { result } = await renderHook(() => useWater(), { wrapper });

    await act(async () => {
      result.current.initializeForDay(1500);
    });

    await act(async () => {
      result.current.addWater(250);
    });

    await act(async () => {
      result.current.initializeForDay(1500);
    }); // second call → no-op

    await waitFor(() => {
      expect(result.current.currentIntake).toBe(1750); // not reset to 1500
    });
  });

  it('addWater and deleteLog still work after initialization', async () => {
    const { result } = await renderHook(() => useWater(), { wrapper });

    await act(async () => {
      result.current.initializeForDay(1000);
    });

    await act(async () => {
      result.current.addWater(250);
    });

    await waitFor(() => {
      expect(result.current.currentIntake).toBe(1250);
    });

    const logId = result.current.history[0].id;
    await act(async () => {
      result.current.deleteLog(logId, 250);
    });

    await waitFor(() => {
      expect(result.current.currentIntake).toBe(1000);
    });
  });
});
