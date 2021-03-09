import { Report } from 'notiflix';

export default function errorMessage({
  graphqlError,
  msgError,
  title,
  buttonLabel,
}) {
  if ((!graphqlError || !graphqlError.message) && !msgError) return;
  const msg = [];
  if (
    graphqlError.networkError &&
    graphqlError.networkError.result &&
    graphqlError.networkError.result.errors.length
  )
    graphqlError.networkError.result.errors.forEach((e) =>
      msg.push(e.message.replace('GraphQL error: ', ''))
    );
  if (graphqlError.message)
    msg.push(graphqlError.message.replace('GraphQL error: ', ''));
  if (msgError) msg.push(msgError);
  Report.Failure(title, msg.join('<br>'), buttonLabel);
}
