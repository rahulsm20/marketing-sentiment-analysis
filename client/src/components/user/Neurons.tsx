import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

type NodeType = {
  id: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
};

type LinkType = {
  source: number | NodeType;
  target: number | NodeType;
};

type SimLink = d3.SimulationLinkDatum<NodeType> & {
  source: NodeType;
  target: NodeType;
};

function generateBrainNodes(
  count: number,
  width: number,
  height: number,
): NodeType[] {
  const nodes: NodeType[] = [];

  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < count; i++) {
    const isLeft = i < count / 2;

    // Elliptical brain shape
    const angle = Math.random() * Math.PI * 2;
    const radiusX = (width / 2.5) * (0.6 + Math.random() * 0.4);
    const radiusY = (height / 2.8) * (0.6 + Math.random() * 0.4);

    let x = centerX + Math.cos(angle) * radiusX;
    const y = centerY + Math.sin(angle) * radiusY;

    // Split into hemispheres
    if (isLeft) {
      x -= width * 0.12;
    } else {
      x += width * 0.12;
    }

    nodes.push({
      id: i,
      x,
      y,
      fx: x, // anchor initial brain shape
      fy: y,
    });
  }

  return nodes;
}
function generateBrainLinks(nodes: NodeType[]): LinkType[] {
  const links: SimLink[] = [];

  nodes.forEach((node) => {
    // connect to nearby nodes (local connections)
    const neighbors = nodes
      .map((n) => ({
        node: n,
        dist: Math.hypot(n.x! - node.x!, n.y! - node.y!),
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(1, 4); // closest 3

    neighbors.forEach((n) => {
      links.push({
        source: node.id,
        target: n.node.id,
      });
    });

    // occasional long-range connection
    if (Math.random() < 0.2) {
      const random = nodes[Math.floor(Math.random() * nodes.length)];
      links.push({
        source: node.id,
        target: random.id,
      });
    }
  });

  return links;
}

export const NeuralNetwork: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const nodes = generateBrainNodes(60, width, height);
    const links = generateBrainLinks(nodes);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3
      .forceSimulation<NodeType>(nodes)
      .force(
        "link",
        d3
          .forceLink<NodeType, SimLink>(links as SimLink[])
          .id((d) => d.id)
          .distance(40)
          .strength(0.6),
      )
      .force("charge", d3.forceManyBody().strength(-30)) // 👈 less chaos
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(8)) // 👈 spacing
      .alphaDecay(0.03);

    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "rgba(255,255,255,0.15)");

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", "#00f0ff")
      .call(
        d3
          .drag<SVGCircleElement, NodeType>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    simulation.on("tick", () => {
      link
        .attr("x1", (d: SimLink) => d.source.x!)
        .attr("y1", (d: SimLink) => d.source.y!)
        .attr("x2", (d: SimLink) => d.target.x!)
        .attr("y2", (d: SimLink) => d.target.y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
    });

    // 🔥 Pulse animation
    const interval = setInterval(() => {
      const randomLink = links[Math.floor(Math.random() * links.length)];

      const source = randomLink.source as NodeType;
      const target = randomLink.target as NodeType;

      if (
        source.x === undefined ||
        target.x === undefined ||
        source.y === undefined ||
        target.y === undefined
      )
        return;

      svg
        .append("circle")
        .attr("r", 3)
        .attr("fill", "#00f0ff")
        .attr("cx", source.x)
        .attr("cy", source.y)
        .transition()
        .duration(600)
        .attr("cx", target.x)
        .attr("cy", target.y)
        .remove();
    }, 300);

    return () => {
      simulation.stop();
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-background neurons lg:w-1/2 w-full h-full"
    >
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default NeuralNetwork;
