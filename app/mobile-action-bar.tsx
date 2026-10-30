import { UIIcon, type UIIconName } from "./ui-icon";
import styles from "./mobile-action-bar.module.css";

type Action = {
  label: string;
  icon: UIIconName;
  ariaLabel?: string;
  count?: number;
  primary?: boolean;
  current?: boolean;
} & ({ href: string; onClick?: never } | { href?: never; onClick: () => void });

export default function MobileActionBar({ actions, label = "Mobile navigation" }: { actions: Action[]; label?: string }) {
  return <nav className={styles.bar} aria-label={label}>
    {actions.map((action) => {
      const className = [styles.action, action.primary ? styles.primary : "", action.current ? styles.current : ""].filter(Boolean).join(" ");
      const accessibleName = action.ariaLabel ?? (action.count === undefined ? action.label : `${action.label}, ${action.count} saved looks`);
      const content = <><span className={styles.icon}><UIIcon name={action.icon} />{action.count !== undefined && action.count > 0 && <span className={styles.count} aria-hidden="true">{action.count > 99 ? "99+" : action.count}</span>}</span><span className={styles.label}>{action.label}</span></>;
      return action.href !== undefined
        ? <a key={action.label} className={className} href={action.href} aria-label={accessibleName} aria-current={action.current ? "location" : undefined}>{content}</a>
        : <button key={action.label} type="button" className={className} onClick={action.onClick} aria-label={accessibleName}>{content}</button>;
    })}
  </nav>;
}
