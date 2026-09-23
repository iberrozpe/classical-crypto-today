import type { DiagramSpec } from "@/lib/content";
import SequenceDiagram from "./SequenceDiagram";
import StructureDiagram from "./StructureDiagram";
import CompareDiagram from "./CompareDiagram";
import MerkleTreeDiagram from "./MerkleTreeDiagram";

export default function DiagramRenderer({ diagram }: { diagram: DiagramSpec }) {
  switch (diagram.type) {
    case "sequence":
      return <SequenceDiagram title={diagram.title} steps={diagram.steps} />;
    case "structure":
      return <StructureDiagram title={diagram.title} blocks={diagram.blocks} />;
    case "compare":
      return <CompareDiagram left={diagram.left} right={diagram.right} />;
    case "merkle":
      return <MerkleTreeDiagram />;
  }
}
