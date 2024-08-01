export const state_authenticated_user = {
  jwt: String(),
  name: String(),
  details: Object(),
  message: String(),
  status: Number(200),
  user: {
    id: Number(0),
    email: String(),
    provider: String(),
    username: String(),
    createdAt: String(),
    updatedAt: String(),
    blocked: Boolean(false),
    confirmed: Boolean(true)
  }
};
