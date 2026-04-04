import { supabaseAuth } from '../config/supabase.js';

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso não autorizado: Token ausente' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Acesso não autorizado: Token inválido ou expirado' });
  }

  req.user = user;
  next();
}
