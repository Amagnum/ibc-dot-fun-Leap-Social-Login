import "./styles.module.css";

import classNames from "classnames";
import React, { ComponentPropsWithoutRef, forwardRef } from "react";

import { Images } from "../../images";

export default function SLHeader({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div
        className="flex w-full flex-row items-center justify-between"
      >
        <div className="text-md font-bold text-white">
          Do you have a wallet?
        </div>
        <div className="flex flex-row">
          <div className="text-sm font-bold text-gray-400">
            powered by capsule
          </div>
          <IconButton onClick={onClose} image={Images.Misc.Cross} />
        </div>
      </div>
    </>
  );
}

/** The `'type'` prop will be `'button'` if `undefined`. */
export type IconButtonProps = ComponentPropsWithoutRef<"button"> & {
  readonly image: Pick<HTMLImageElement, "src" | "alt">;
  readonly isFilled?: boolean;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ type, image, isFilled, ...rest }, ref) => (
    <div
      className={classNames({
        "h-9 w-9 bg-white-100 dark:bg-gray-900 flex items-center justify-center rounded-full":
          isFilled,
      })}
    >
      <button
        className="flex cursor-pointer border-none"
        ref={ref}
        type={type ?? "button"}
        {...rest}
      >
        <img className="invert dark:invert-0" src={image.src} alt={image.alt} />
      </button>
    </div>
  ),
);

IconButton.displayName = "IconButton";
