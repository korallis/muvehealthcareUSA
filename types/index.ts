export interface PuckComponentProps {
  puck?: {
    dragRef?: React.Ref<HTMLElement>;
  };
}

export interface NavLink {
  title: string;
  href: string;
  dropdownBg?: string;
  textColor?: string;
  subLinks?: { title: string; href: string }[];
}

export interface NavbarProps extends PuckComponentProps {
  logo?: string;
  links?: NavLink[];
}
