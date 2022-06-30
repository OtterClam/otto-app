type ExtractProps<TComponentOrTProps> = TComponentOrTProps extends React.Component<infer TProps, any>
  ? TProps
  : TComponentOrTProps
