/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useCallback } from "react";
import { useStackedPage } from "react-stacked-pages-hook";

interface LinkToStackedProps {
  to: string;
  onClick: function;
  onMouseLeave: function;
  onMouseEnter: function;
}

export default const LinkToStacked = React.forwardRef<HTMLAnchorElement, LinkToStackedProps>((props, ref) => {
  const { to, onClick, onMouseLeave, onMouseEnter, ...restProps } = props;
  const [, , , navigateToStackedPage, highlightStackedPage] = useStackedPage();

  const onClickHandler = useCallback(
    (ev) => {
      ev.preventDefault();
      if (onClick) {
        onClick(ev);
      }

      const isMac = window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;

      /* Override command + click on MacOS and Ctrl + click on other OS */
      if ((isMac && ev.metaKey) || (!isMac && ev.ctrlKey)) {
        window.open(to, "_blank");
      }
      else {
        navigateToStackedPage(to);
      }
    },
    [navigateToStackedPage, to, onClick],
  );

  const onMouseEnterHandler = useCallback(
    (ev) => {
      highlightStackedPage(to, true);
      if (onMouseEnter) {
        onMouseEnter(ev);
      }
    },
    [to, onMouseEnter, highlightStackedPage],
  );

  const onMouseLeaveHandler = useCallback(
    (ev) => {
      highlightStackedPage(to, false);
      if (onMouseLeave) {
        onMouseLeave(ev);
      }
    },
    [to, onMouseLeave, highlightStackedPage],
  );

  return (
    <Link
      {...restProps}
      to={to}
      ref={ref}
      onClick={onClickHandler}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
    />
  );
});
