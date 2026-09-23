import type { DiagramSpec } from "@/lib/content";
import SequenceDiagram from "./SequenceDiagram";
import StructureDiagram from "./StructureDiagram";
import CompareDiagram from "./CompareDiagram";
import MerkleTreeDiagram from "./MerkleTreeDiagram";
import GridDiagram from "./GridDiagram";
import CurvePointAdditionDiagram from "./CurvePointAdditionDiagram";
import SwimlaneDiagram from "./SwimlaneDiagram";
import PipelineDiagram from "./PipelineDiagram";
import GcmDiagram from "./GcmDiagram";
import OaepDiagram from "./OaepDiagram";

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
    case "grid":
      return <GridDiagram title={diagram.title} rows={diagram.rows} caption={diagram.caption} />;
    case "ec-point-addition":
      return <CurvePointAdditionDiagram />;
    case "swimlane":
      return (
        <SwimlaneDiagram
          title={diagram.title}
          leftActor={diagram.leftActor}
          rightActor={diagram.rightActor}
          messages={diagram.messages}
          caption={diagram.caption}
        />
      );
    case "pipeline":
      return (
        <PipelineDiagram
          title={diagram.title}
          steps={diagram.steps}
          loopLabel={diagram.loopLabel}
          caption={diagram.caption}
        />
      );
    case "gcm":
      return <GcmDiagram />;
    case "oaep":
      return <OaepDiagram />;
  }
}
