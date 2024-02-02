import styles from "./inline-edit.module.css";

import { cn } from "#/lib/utils";
import {
  type UIAnalyticsEvent,
  usePlatformLeafEventHandler,
} from "@atlaskit/analytics-next";
import Button from "@atlaskit/button/standard-button";
import Field from "@atlaskit/form/Field";
import Form from "@atlaskit/form/Form";
import ConfirmIcon from "@atlaskit/icon/glyph/check";
import CancelIcon from "@atlaskit/icon/glyph/cross";
import { B400, N0, N20A, N30A, N50A, N60A } from "@atlaskit/theme/colors";
import { token } from "@atlaskit/tokens";
import { css } from "@emotion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { fontSize } from "./constants";
import ReadView from "./internal/read-view";
import { type InlineEditProps } from "./types";

const analyticsAttributes = {
  componentName: "inlineEdit",
  packageName: process.env._PACKAGE_NAME_!,
  packageVersion: process.env._PACKAGE_VERSION_!,
};

const noop = () => {};

const InnerInlineEdit = <FieldValue extends unknown>(
  props: InlineEditProps<FieldValue>,
) => {
  const {
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
    label,
    validate,
    readView,
    editView,
    analyticsContext,
    onConfirm: providedOnConfirm,
    onCancel: providedOnCancel = noop,
    onEdit: providedOnEdit = noop,
  } = props;

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

  const onConfirm = usePlatformLeafEventHandler({
    fn: (value: string, analyticsEvent: UIAnalyticsEvent) => {
      if (isControlled) {
        setEditingState(false);
      }
      providedOnConfirm(value, analyticsEvent);
    },
    action: "confirmed",
    analyticsData: analyticsContext,
    ...analyticsAttributes,
  });

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
      onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void,
      formRef: React.RefObject<HTMLFormElement>,
    ) => {
      if (
        !isFieldInvalid &&
        !wasFocusReceivedSinceLastBlurRef.current &&
        formRef.current
      ) {
        doNotFocusOnEditButton();
        if (formRef.current.checkValidity()) {
          onSubmit();
        }
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
      onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void,
      formRef: React.RefObject<HTMLFormElement>,
    ) => {
      if (!keepEditViewOpenOnBlur) {
        wasFocusReceivedSinceLastBlurRef.current = false;
        timerRef.current = setTimeout(
          () => tryAutoSubmitWhenBlur(isFieldInvalid, onSubmit, formRef),
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

  const renderReadView = () => {
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

  if (shouldBeEditing) {
    return (
      <Form
        onSubmit={(data: { inlineEdit: any }) => onConfirm(data.inlineEdit)}
      >
        {({ formProps: { onKeyDown, onSubmit, ref: formRef } }) => (
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
              onKeyDown(e);
              if (e.key === "Esc" || e.key === "Escape") {
                onCancel();
              }
            }}
            onSubmit={onSubmit}
            ref={formRef}
          >
            <Field
              name="inlineEdit"
              label={label}
              defaultValue={defaultValue}
              validate={validate}
              isRequired={isRequired}
              key="edit-view" // used for reset to default value
            >
              {({ fieldProps, error }) => (
                <div
                  className="relative max-w-full"
                  onBlur={() => {
                    onEditViewWrapperBlur(
                      fieldProps.isInvalid,
                      onSubmit,
                      formRef,
                    );
                  }}
                  onFocus={onEditViewWrapperFocus}
                >
                  {editView(
                    {
                      ...fieldProps,
                      errorMessage: error,
                    },
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
              )}
            </Field>
          </form>
        )}
      </Form>
    );
  }

  return (
    /** Form, Field are used here only for the label and spacing */
    <form>
      <Field
        name="inlineEdit"
        label={label}
        defaultValue=""
        isRequired={isRequired}
        key="read-view" // used for reset to default value
      >
        {renderReadView}
      </Field>
    </form>
  );
};

const InlineEdit = <FieldValue extends unknown = string>(
  props: InlineEditProps<FieldValue>,
) => {
  return <InnerInlineEdit<FieldValue> {...props} />;
};

const usePrevious = (value: any) => {
  const ref = useRef();

  useEffect(() => {
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
      if (preventFocusOnEditButtonRef && preventFocusOnEditButtonRef.current) {
        preventFocusOnEditButtonRef.current = false;
      } else if (editButtonRef?.current) {
        // @ts-ignore
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
    <div className={cn("absolute flex flex-shrink-0", styles.buttonsContainer)}>
      <ButtonWrapperBase>
        <Button
          aria-label={confirmButtonLabel}
          type="submit"
          iconBefore={<ConfirmIcon label={confirmButtonLabel} size="small" />}
          shouldFitContainer
          onMouseDown={onMouseDown}
        />
      </ButtonWrapperBase>
      <ButtonWrapperBase>
        <Button
          aria-label={cancelButtonLabel}
          iconBefore={<CancelIcon label={cancelButtonLabel} size="small" />}
          onClick={onCancelClick}
          shouldFitContainer
          onMouseDown={onMouseDown}
        />
      </ButtonWrapperBase>
    </div>
  );
};

const ButtonWrapperBase = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "z-[200] box-border w-8 rounded-[3px] bg-white ",
        styles.buttonWrapperBase,
      )}
    >
      {children}
    </div>
  );
};

export { InlineEdit };
