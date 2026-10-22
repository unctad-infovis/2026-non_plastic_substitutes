import './ChartHeader.css';

export default function ChartHeader({ title, subtitle, description, large = false, children }) {
  return (
    <>
      <div className="nps_header">
        <div className="nps_header_top">
          <div className="nps_header_icon" />
          <h3 className={`nps_header_title${large ? ' nps_header_title--lg' : ''}`}>{title}</h3>
        </div>
        {subtitle && <p className="nps_header_subtitle">{subtitle}</p>}
      </div>
      {(description || children) && (
        <p className="nps_insight">
          {description}
          {description && children && (
            <>
              <br />
              <br />
            </>
          )}
          {children}
        </p>
      )}
    </>
  );
}
