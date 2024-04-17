"use client";

import styles from "./inline-edit.module.css";

import { Icon } from "#/components/Icon";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

type InlineEditProps = {
  startWithEditViewOpen?: boolean;
  keepEditViewOpenOnBlur?: boolean;
  hideActionButtons?: boolean;
  isRequired?: boolean;
  readViewFitContainerWidth?: boolean;
  editButtonLabel?: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  defaultValue?: string;
  isEditing?: boolean;
  validate?: (value: string) => string | undefined;
  readView: () => React.ReactNode;
  editView: (
    fieldProps: {
      name: "inlineEdit";
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
      min?: string | number;
      max?: string | number;
      maxLength?: number;
      minLength?: number;
      pattern?: string;
      required?: boolean;
      disabled?: boolean;
      errorMessage: string | undefined;
      isInvalid: boolean;
    },
    ref: React.RefObject<HTMLInputElement>,
  ) => React.ReactNode;
  onConfirm: (value: string) => void;
  onCancel?: () => void;
  onEdit?: () => void;
};

type FormInputs = {
  inlineEdit: string;
};

const InlineEdit = ({
  startWithEditViewOpen = false,
  keepEditViewOpenOnBlur = false,
  hideActionButtons = false,
  isRequired = false,
  readViewFitContainerWidth = false,
  editButtonLabel = "Edit",
  confirmButtonLabel = "Confirm",
  cancelButtonLabel = "Cancel",
  defaultValue,
  isEditing,
  validate,
  readView,
  editView,
  onConfirm: providedOnConfirm,
  onCancel: providedOnCancel = () => {
    /* no-op */
  },
  onEdit: providedOnEdit = () => {
    /* no-op */
  },
}: InlineEditProps) => {
  const wasFocusReceivedSinceLastBlurRef = useRef(false);
  const isControlled = typeof isEditing === "undefined";
  const [isEditingState, setEditingState] = useState(startWithEditViewOpen);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const {
    editButtonRef,
    editViewRef,
    shouldBeEditing,
    doNotFocusOnEditButton,
  } = useButtonFocusHook(isEditing, isEditingState);

  const onCancel = useCallback(() => {
    if (isControlled) {
      setEditingState(false);
    }
    providedOnCancel();
  }, [isControlled, providedOnCancel]);

  const onEditRequested = useCallback(() => {
    if (isControlled) {
      setEditingState(true);
    }
    providedOnEdit();
    if (shouldBeEditing && editViewRef.current) {
      editViewRef.current.focus();
    }
  }, [isControlled, shouldBeEditing, editViewRef, providedOnEdit]);

  const onConfirm = (value: string) => {
    if (isControlled) {
      setEditingState(false);
    }
    providedOnConfirm(value);
  };

  const onCancelClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      onCancel();
    },
    [onCancel],
  );

  const tryAutoSubmitWhenBlur = useCallback(
    (
      isFieldInvalid: boolean,
      onSubmit: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        e?: React.BaseSyntheticEvent<object, any, any> | undefined,
      ) => Promise<void>,
    ) => {
      if (!isFieldInvalid && !wasFocusReceivedSinceLastBlurRef.current) {
        doNotFocusOnEditButton();
        void onSubmit();
      }
    },
    [doNotFocusOnEditButton],
  );

  /** If keepEditViewOpenOnBlur prop is set to false, will call confirmIfUnfocused() which
   *  confirms the value, if the focus is not transferred to the action buttons
   *
   *  When you're in `editing` state, the focus will be on the input field. And if you use keyboard
   *  to navigate to `submit` button, this function will be invoked. Then function `onEditViewWrapperFocus`
   *  will be called, the timeout used here is making sure `onEditViewWrapperFocus` is always called before
   *  `autoSubmitWhenBlur`.
   *
   *  There are two paths here the function can be triggered:
   *
   *  - focus on input first, and then use keyboard to `submit`
   *  - focus on input first, and then click anywhere else on the page (outside of edit view wrapper) to `submit` (auto save)
   */
  const onEditViewWrapperBlur = useCallback(
    (
      isFieldInvalid: boolean,
      onSubmit: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        e?: React.BaseSyntheticEvent<object, any, any> | undefined,
      ) => Promise<void>,
    ) => {
      if (!keepEditViewOpenOnBlur) {
        wasFocusReceivedSinceLastBlurRef.current = false;
        timerRef.current = setTimeout(
          () => tryAutoSubmitWhenBlur(isFieldInvalid, onSubmit),
          0,
        );
      }
    },
    [keepEditViewOpenOnBlur, tryAutoSubmitWhenBlur],
  );

  /** Gets called when focus is transferred to the editView, or action buttons
   *
   * There are three paths here the function can be called:
   *
   * - when a user click the `editView`
   * - when a user use keyboard to tab into `editView`
   * - when a user use keyboard to tab into `submit` when they were on input field
   */
  const onEditViewWrapperFocus = useCallback(() => {
    wasFocusReceivedSinceLastBlurRef.current = true;
  }, []);

  const { register, handleSubmit, formState } = useForm<FormInputs>({
    defaultValues: {
      inlineEdit: defaultValue ?? "",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = data =>
    onConfirm(data.inlineEdit);

  const registerReturn = register("inlineEdit", {
    required: isRequired,
    validate: validate,
  });
  // Share a ref between the register func and the editViewRef
  useImperativeHandle(registerReturn.ref, () => editViewRef.current);

  if (shouldBeEditing) {
    return (
      <form
        /**
         * It is not normally acceptable to add key handlers to non-interactive elements
         * as this is an accessibility anti-pattern. However, because this instance is
         * to add support for keyboard functionality instead of creating an inaccessible
         * custom element, we can add role="presentation" so that there is no negative
         * impacts to assistive technologies.
         */
        role="presentation"
        onKeyDown={e => {
          if (e.key === "Esc" || e.key === "Escape") {
            onCancel();
          }
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div
          className="relative max-w-full"
          onBlur={() => {
            onEditViewWrapperBlur(!formState.isValid, handleSubmit(onSubmit));
          }}
          onFocus={onEditViewWrapperFocus}
        >
          {editView(
            {
              ...registerReturn,
              errorMessage: formState.errors.inlineEdit?.message,
              isInvalid: Boolean(formState.errors.inlineEdit),
            },
            //@ts-expect-error for now until we can fix
            editViewRef,
          )}
          {!hideActionButtons ? (
            <Buttons
              cancelButtonLabel={cancelButtonLabel}
              confirmButtonLabel={confirmButtonLabel}
              onMouseDown={() => {
                /** Prevents focus on edit button only if mouse is used to click button, but not when keyboard is used */
                doNotFocusOnEditButton();
              }}
              onCancelClick={onCancelClick}
            />
          ) : (
            /** This is to allow Ctrl + Enter to submit without action buttons */
            <button hidden type="submit" aria-label="Submit" />
          )}
        </div>
      </form>
    );
  }

  return (
    <ReadView
      editButtonLabel={editButtonLabel}
      onEditRequested={onEditRequested}
      postReadViewClick={doNotFocusOnEditButton}
      editButtonRef={editButtonRef}
      readViewFitContainerWidth={readViewFitContainerWidth}
      readView={readView}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const usePrevious = (value: any) => {
  const ref = useRef();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ref.current = value;
  }, [value]);

  return ref.current;
};

const useButtonFocusHook = (
  isEditing: boolean | undefined,
  isEditingState: boolean,
) => {
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const editViewRef = useRef<HTMLElement>();
  const preventFocusOnEditButtonRef = useRef(false);

  const isControlled = typeof isEditing === "undefined";
  const shouldBeEditing = isControlled ? isEditingState : isEditing;
  const prevIsEditing = usePrevious(shouldBeEditing);

  useEffect(() => {
    if (isEditingState && editViewRef.current) {
      editViewRef.current.focus();
    }
  }, [editViewRef, isEditingState]);

  useEffect(() => {
    /**
     * This logic puts the focus on the edit button after confirming using
     * the confirm button or using the keyboard to confirm, but not when
     * it is confirmed by wrapper blur
     */
    if (prevIsEditing && !shouldBeEditing) {
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      if (preventFocusOnEditButtonRef && preventFocusOnEditButtonRef.current) {
        preventFocusOnEditButtonRef.current = false;
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      } else if (editButtonRef && editButtonRef.current) {
        editButtonRef.current.focus();
      }
    }
  }, [prevIsEditing, shouldBeEditing]);

  const doNotFocusOnEditButton = () =>
    (preventFocusOnEditButtonRef.current = true);

  return {
    editButtonRef,
    editViewRef,
    shouldBeEditing,
    doNotFocusOnEditButton,
  };
};

interface ButtonsProp {
  confirmButtonLabel: string;
  cancelButtonLabel: string;
  onMouseDown: () => void;
  onCancelClick: (event: React.MouseEvent<HTMLElement>) => void;
}
const Buttons = ({
  confirmButtonLabel,
  cancelButtonLabel,
  onMouseDown,
  onCancelClick,
}: ButtonsProp) => {
  return (
    <div
      className={cn(
        "absolute end-0 flex flex-shrink-0",
        styles.buttonsContainer,
      )}
    >
      <Button
        className="z-50 shadow-lg dark:border-stone-200 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100 dark:hover:text-stone-900"
        variant="outline"
        size="icon"
        aria-label={confirmButtonLabel}
        type="submit"
        onMouseDown={onMouseDown}
      >
        <Icon name="check" className="h-4 w-4" />
      </Button>
      <Button
        className="z-50 shadow-lg dark:border-stone-200 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100 dark:hover:text-stone-900"
        aria-label={cancelButtonLabel}
        variant="outline"
        size="icon"
        onClick={onCancelClick}
        onMouseDown={onMouseDown}
      >
        <Icon name="x" className="h-4 w-4" />
      </Button>
    </div>
  );
};

const DRAG_THRESHOLD = 5;

interface ReadViewProps {
  editButtonLabel: string;
  onEditRequested: () => void;
  postReadViewClick: () => void;
  editButtonRef: React.RefObject<HTMLButtonElement>;
  readViewFitContainerWidth?: boolean;
  readView: () => React.ReactNode;
}

const ReadView = ({
  editButtonLabel,
  onEditRequested,
  postReadViewClick,
  editButtonRef,
  readViewFitContainerWidth,
  readView,
}: ReadViewProps) => {
  const startX = useRef(0);
  const startY = useRef(0);

  const mouseHasMovedAfterMouseDown = (event: {
    clientX: number;
    clientY: number;
  }) => {
    return (
      Math.abs(startX.current - event.clientX) >= DRAG_THRESHOLD ||
      Math.abs(startY.current - event.clientY) >= DRAG_THRESHOLD
    );
  };

  const onReadViewClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    const element = event.target as HTMLElement;
    /** If a link is clicked in the read view, default action should be taken */
    if (
      element.tagName.toLowerCase() !== "a" &&
      !mouseHasMovedAfterMouseDown(event)
    ) {
      event.preventDefault();
      onEditRequested();
      postReadViewClick();
    }
  };

  return (
    <div className="group text-lg">
      <button
        className="m-0 block appearance-none border-0 bg-transparent p-0 outline-0"
        aria-label={editButtonLabel}
        type="button"
        onClick={onEditRequested}
        ref={editButtonRef}
      />
      <div
        className={cn(
          "transition-background box-border inline-block w-auto max-w-full rounded-[3px] duration-200 hover:bg-[#EBECF0] group-focus:border-2 group-focus:border-[#4c9aff]",
          readViewFitContainerWidth && "w-full",
        )}
        /**
         * It is not normally acceptable to add click handlers to non-interactive elements
         * as this is an accessibility anti-pattern. However, because this instance is
         * account for clicking on links that may be embedded within inline-edit and not
         * creating an inaccessible custom element, we can add role="presentation" so that
         * there is no negative impacts to assistive technologies.
         * (Why links are embeeded in inline-edit is for another day...)
         */
        role="presentation"
        onClick={onReadViewClick}
        onMouseDown={e => {
          startX.current = e.clientX;
          startY.current = e.clientY;
        }}
        data-read-view-fit-container-width={readViewFitContainerWidth}
      >
        {readView()}
      </div>
    </div>
  );
};

export { InlineEdit };
