import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { ComponentPropsWithoutRef, forwardRef } from "react";


import { ModalStep } from "../../constant";

export default function SLHeader({
  currentStep,
  onClose,
  onBack,
}: {
  currentStep: ModalStep;
  onClose: () => void;
  onBack: () => void;
}) {
  return (
    <>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row text-center gap-x-2">
          {ModalStep.EMAIL_COLLECTION !== currentStep && (
            <button style={{ marginRight: "0.5rem" }}>
              <ArrowLeftIcon
                onClick={onBack}
                className="w-6 h-6 cursor-pointer"
              />
            </button>
          )}
        </div>
        <div className="flex flex-row text-center items-center">
          <button
            onClick={onClose}
            className="text-xs text-gray-400 cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6 cursor-pointer" />
          </button>
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
