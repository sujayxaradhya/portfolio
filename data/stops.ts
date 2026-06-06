import { projects, type Project } from "./projects";

export type GlobeStop = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  project?: Project;
};

export const stops: GlobeStop[] = [
  { id: "hero", label: "Top", lat: 20, lng: 0 },
  { id: "atlas", label: "Atlas", lat: 12.97, lng: 77.59, project: projects[0] },
  { id: "marginalia", label: "Marginalia", lat: 37.77, lng: -122.42, project: projects[1] },
  { id: "field-notes", label: "Field Notes", lat: 52.52, lng: 13.41, project: projects[2] },
  { id: "index", label: "Index", lat: 35.68, lng: 139.69, project: projects[3] },
  { id: "about", label: "About", lat: 51.51, lng: -0.13 },
  { id: "experience", label: "Experience", lat: 40.71, lng: -74.01 },
  { id: "skills", label: "Skills", lat: 1.35, lng: 103.82 },
  { id: "contact", label: "Contact", lat: -23.55, lng: -46.63 },
];