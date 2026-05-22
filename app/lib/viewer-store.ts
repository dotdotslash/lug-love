import { create } from "zustand";

export type ViewDirection = "Top" | "Bottom" | "Left" | "Right" | "Front" | "Back";
export type ViewerMode = "perspective" | "ortho";
export type MaterialType = "photoscan" | "metal" | "outline" | "crosshatch";

// Camera positions for each named ortho view direction – matches split.js
export const VIEW_POSITIONS: Record<ViewDirection, [number, number, number]> = {
  Top: [0, 10, 0],
  Bottom: [0, -10, 0],
  Left: [-10, 0, 0],
  Right: [10, 0, 0],
  Front: [0, 0, 10],
  Back: [0, 0, -10],
};

type ViewerState = {
  // Viewer mode
  viewerMode: ViewerMode;
  setViewerMode: (mode: ViewerMode) => void;

  // Material system
  materialType: MaterialType;
  setMaterialType: (type: MaterialType) => void;
  showTexture: boolean;
  showWireframe: boolean;
  showAngleLines: boolean;
  toggleTexture: () => void;
  toggleWireframe: () => void;
  toggleAngleLines: () => void;

  // Ortho panel view directions (from split.js)
  top: ViewDirection;
  middle: ViewDirection;
  bottom: ViewDirection;
  setPanelView: (which: "top" | "middle" | "bottom", view: ViewDirection) => void;
};

export const useViewerStore = create<ViewerState>((set) => ({
  viewerMode: "perspective",
  setViewerMode: (mode) => set({ viewerMode: mode }),

  materialType: "metal",
  setMaterialType: (type) => set({ materialType: type }),
  showTexture: true,
  showWireframe: false,
  showAngleLines: false,
  toggleTexture: () => set((s) => ({ showTexture: !s.showTexture })),
  toggleWireframe: () => set((s) => ({ showWireframe: !s.showWireframe })),
  toggleAngleLines: () => set((s) => ({ showAngleLines: !s.showAngleLines })),

  // Defaults match the original split.js store
  top: "Back",
  middle: "Top",
  bottom: "Right",
  setPanelView: (which, view) => set({ [which]: view }),
}));
