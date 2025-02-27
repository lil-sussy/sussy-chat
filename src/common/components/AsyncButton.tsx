import { Button, ButtonProps, Tooltip } from "antd";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { LoadingOutlined } from "@ant-design/icons";

interface AsyncButtonProps extends ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  forceIsLoading?: boolean;
  forceErrorMessage?: string;
}

export const AsyncButton = ({
  onClick,
  disabled,
  forceIsLoading,
  forceErrorMessage,
  className,
  ...props
}: AsyncButtonProps) => {
  const [isLoading, setIsLoading] = useState(forceIsLoading);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    forceErrorMessage || null,
  );
  const [confettisBusrt, setConfettisBusrt] = useState(0);
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    setIsLoading(forceIsLoading);
    if (forceErrorMessage) {
      setErrorMessage(forceErrorMessage);
    }
  }, [forceIsLoading, forceErrorMessage]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClick) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await onClick(e);
      setConfettisBusrt(confettisBusrt + 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonState = (): ButtonProps["type"] => {
    if (errorMessage) return "primary";
    return props.type || "default";
  };

  return (
    <Tooltip
      title={errorMessage}
      open={!!errorMessage}
      color="red"
      classNames={{ root: "max-w-[300px]" }}
    >
      {/* <ConfettiBurst refresh={confettisBusrt} count={20} colors={["#ff577f", "#ff884b", "#ffd384", "#a0ffe6"]}> */}
      <Button
        {...props}
        type={getButtonState()}
        icon={isLoading ? <></> : props.icon}
        loading={isLoading}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={clsx(
          "transition-all duration-300",
          isLoading ? "h-16 w-16" : "",
          className,
        )}
      >
        {isLoading ? <LoadingOutlined /> : props.children}
      </Button>
      {/* </ConfettiBurst> */}
    </Tooltip>
  );
};
