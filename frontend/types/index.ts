export type RoadmapItem = {
  id: number;
  order: number;
  post: {
    title: string;
    slug: string;
  };
};

export type Roadmap = {
  id: number;
  title: string;
  description: string | null;
  items: RoadmapItem[];
};
