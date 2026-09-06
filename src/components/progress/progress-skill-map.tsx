"use client";

import * as React from "react";
import { cn } from "cn";
import { categoryColors } from "@/design/colors";
import {
  SKILL_MAP_EDGES,
  SKILL_NODE_CATEGORY,
  depthDots,
  type SkillMapNodeId,
  type SkillMapNodeState,
} from "@/lib/de-code/progress-cockpit";

const NODE_RADIUS = 22;
const CENTER = { x: 210, y: 196 };

function nodeFill(nodeId: SkillMapNodeId, level: SkillMapNodeState["level"]): string {
  const cat = categoryColors[SKILL_NODE_CATEGORY[nodeId]];
  if (level === "strong") return cat.hue;
  if (level === "developing") return cat.glow;
  return "rgba(255, 255, 255, 0.1)";
}

function nodeStroke(nodeId: SkillMapNodeId): string {
  return categoryColors[SKILL_NODE_CATEGORY[nodeId]].hue;
}

function SkillDetailPanel({ node }: { node: SkillMapNodeState }) {
  const accent = categoryColors[SKILL_NODE_CATEGORY[node.id]].hue;

  if (!node.detailTopics?.length) {
    return (
      <div className="pc-surface mt-6 p-5">
        <p className="text-sm font-medium text-foreground">{node.label}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {node.percent}% explored · keep practicing related problems and challenges.
        </p>
      </div>
    );
  }

  return (
    <div
      className="pc-surface mt-6 p-5"
      style={{ ["--depth-accent" as string]: accent }}
    >
      <p className="text-sm font-medium text-foreground">{node.label}</p>
      <div className="mt-4 space-y-3">
        {node.detailTopics.map((row) => (
          <div key={`${row.track}-${row.topicId}`} className="flex items-center justify-between gap-4">
            <span className="text-sm text-foreground">{row.label}</span>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {depthDots(row.depth).map((filled, i) => (
                  <span
                    key={i}
                    className={cn("pc-depth-dot", filled && "pc-depth-dot-filled")}
                  />
                ))}
              </div>
              <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
                {row.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-[var(--platform-ink-muted)]">
        Depth is based on concept coverage · difficulty · consistency
      </p>
    </div>
  );
}

export function ProgressSkillMap({
  nodes,
  selectedId,
  onSelect,
}: {
  nodes: SkillMapNodeState[];
  selectedId: SkillMapNodeId | null;
  onSelect: (id: SkillMapNodeId) => void;
}) {
  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<
    string,
    SkillMapNodeState
  >;
  const selected = selectedId ? nodeById[selectedId] : null;

  return (
    <section>
      <p className="pc-label">Skill map</p>
      <div className="pc-card mt-4 overflow-hidden p-4 sm:p-6">
        <svg
          viewBox="0 0 420 360"
          className="mx-auto h-auto w-full max-w-2xl"
          role="img"
          aria-label="Data engineering skill map"
        >
          <defs>
            <linearGradient id="skill-map-edge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(124, 58, 237, 0.25)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
            </linearGradient>
          </defs>

          {SKILL_MAP_EDGES.map(([from, to]) => {
            const a = nodeById[from];
            const b = nodeById[to];
            if (!a || !b) return null;
            return (
              <line
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="url(#skill-map-edge)"
                strokeWidth="1.5"
              />
            );
          })}

          <line
            x1={CENTER.x}
            y1={CENTER.y}
            x2={210}
            y2={44}
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1={CENTER.x}
            y1={CENTER.y}
            x2={356}
            y2={196}
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          <circle cx={CENTER.x} cy={CENTER.y} r="28" fill="var(--muted)" stroke="var(--border)" />
          <text
            x={CENTER.x}
            y={CENTER.y + 4}
            textAnchor="middle"
            className="fill-muted-foreground text-[11px] font-medium"
          >
            YOU
          </text>

          {nodes.map((node) => {
            const isSelected = selectedId === node.id;
            const isPrimary = ["sql", "pyspark", "etl", "data-quality"].includes(node.id);
            const fill = nodeFill(node.id, node.level);
            const stroke = nodeStroke(node.id);

            if (!isPrimary && ["analytics", "joins"].includes(node.id)) {
              return (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r="10" fill={fill} />
                  <text
                    x={node.x}
                    y={node.y + 22}
                    textAnchor="middle"
                    className="fill-[var(--platform-ink-muted)] text-[9px]"
                  >
                    {node.label}
                  </text>
                </g>
              );
            }

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onClick={() => onSelect(node.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onSelect(node.id);
                }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS}
                  fill={fill}
                  stroke={isSelected ? stroke : "transparent"}
                  strokeWidth="2"
                  className={cn(isSelected && "pc-pulse")}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  className="fill-foreground text-[10px] font-medium"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[rgba(255,255,255,0.1)]" /> Unexplored
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[rgba(139,92,246,0.35)]" /> Developing
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--platform-brand-violet)]" /> Strong
          </span>
        </div>
      </div>

      {selected ? <SkillDetailPanel node={selected} /> : null}
    </section>
  );
}
