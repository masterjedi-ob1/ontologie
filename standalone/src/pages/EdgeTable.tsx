import { Table, TableBody, TableCell, TableHead, TableRow, Box } from "@mui/material";
import type { GEdge, GNode } from "../components/PathGraph";

/** 1:1 accessible alternative to a PathGraph: every edge as a row. */
export const EdgeTable = ({ nodes, edges, caption }: { nodes: GNode[]; edges: GEdge[]; caption: string }) => {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const kind = (n?: GNode) => (n ? n.kind[0].toUpperCase() + n.kind.slice(1) : "—");
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table size="small">
        <caption style={{ captionSide: "top", textAlign: "left", padding: "0 0 8px", fontSize: 12, color: "#64748B" }}>{caption}</caption>
        <TableHead>
          <TableRow>
            <TableCell>From</TableCell>
            <TableCell>Relationship</TableCell>
            <TableCell>To</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {edges.map((e) => {
            const a = byId.get(e.from);
            const b = byId.get(e.to);
            return (
              <TableRow key={`${e.from}-${e.to}`} hover>
                <TableCell>
                  {a?.label ?? "—"} <Box component="span" sx={{ color: "text.secondary" }}>({kind(a)}{a?.missing ? ", gap" : ""})</Box>
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>{e.label}</TableCell>
                <TableCell>
                  {b?.label ?? "—"} <Box component="span" sx={{ color: "text.secondary" }}>({kind(b)}{b?.status ? `, ${b.status}` : ""})</Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};
