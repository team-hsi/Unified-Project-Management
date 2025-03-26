// export const WithStatusStyle = (Component: React.ComponentType) => {
//   const WithStatusStyles = (props: Omit<P, keyof WithStatusStylesProps> & StatusIdProps) => {
//     const { statusId, ...rest } = props
//     const statusStyles = getStatusStyles(statusId)

//     // Cast is needed due to TypeScript limitations with HOCs
//     return <Component {...(rest as any)} statusStyles={statusStyles} />
//   }
