import './ChartMeta.css';

export default function ChartMeta({ note, source }) {
  if (!source && !note) return null;
  return (
    <div className="nps_meta">
      {source && (
        <div className="nps_meta_row">
          <em>Source:</em> {source}
        </div>
      )}
      {note && (
        <div className="nps_meta_row">
          <em>Note:</em> {note}
        </div>
      )}
    </div>
  );
}
