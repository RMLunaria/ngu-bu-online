'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { WebSocketServer, WebSocket } = require('ws');

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const INDEX = path.join(__dirname, 'index.html');
const rooms = new Map();
const spawnPoints = [];
for (const z of [-3, -1, 1, 3]) {
  for (const x of [-3, -1, 1, 3]) spawnPoints.push({ x, z });
}

function cleanRoom(value) {
  return String(value || 'phong-1').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 24) || 'phong-1';
}
function cleanName(value) {
  const name = String(value || 'Khách').replace(/[<>\u0000-\u001f]/g, '').trim().slice(0, 16);
  return name || 'Khách';
}
function clampNumber(value, min, max, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback;
}
function snapshot(peer) {
  return {
    id: peer.id,
    name: peer.name,
    x: peer.state.x,
    y: peer.state.y,
    z: peer.state.z,
    rx: peer.state.rx,
    ry: peer.state.ry,
    moving: peer.state.moving,
    pose: peer.state.pose
  };
}
function broadcast(room, data, except = null) {
  const payload = JSON.stringify(data);
  for (const peer of room.values()) {
    if (peer.ws !== except && peer.ws.readyState === WebSocket.OPEN) peer.ws.send(payload);
  }
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  if (pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, rooms: rooms.size }));
    return;
  }
  if (pathname !== '/' && pathname !== '/index.html') {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  fs.readFile(INDEX, (err, body) => {
    if (err) {
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Không đọc được index.html');
      return;
    }
    res.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    });
    res.end(body);
  });
});

const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 16 * 1024 });
wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const roomCode = cleanRoom(url.searchParams.get('room'));
  const name = cleanName(url.searchParams.get('name'));
  if (!rooms.has(roomCode)) rooms.set(roomCode, new Map());
  const room = rooms.get(roomCode);
  const used = new Set([...room.values()].map(p => p.spawnIndex));
  let spawnIndex = spawnPoints.findIndex((_, i) => !used.has(i));
  if (spawnIndex < 0) spawnIndex = room.size % spawnPoints.length;
  const spawn = spawnPoints[spawnIndex];
  const peer = {
    id: randomUUID(), name, roomCode, spawnIndex, ws,
    lastUpdate: 0,
    state: { x: spawn.x, y: 0, z: spawn.z, rx: 0, ry: 0, moving: false, pose: 'walk' }
  };
  const existing = [...room.values()].map(snapshot);
  room.set(peer.id, peer);
  ws.send(JSON.stringify({ type: 'welcome', id: peer.id, spawn, players: existing, count: room.size }));
  broadcast(room, { type: 'join', player: snapshot(peer), count: room.size }, ws);

  ws.on('message', raw => {
    const now = Date.now();
    if (now - peer.lastUpdate < 45) return;
    peer.lastUpdate = now;
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }
    if (!msg || msg.type !== 'state' || !msg.state || typeof msg.state !== 'object') return;
    const s = msg.state;
    peer.state = {
      x: clampNumber(s.x, -31.2, 31.2),
      y: clampNumber(s.y, -1, 3),
      z: clampNumber(s.z, -31.2, 31.2),
      rx: clampNumber(s.rx, -Math.PI / 2, Math.PI / 2),
      ry: clampNumber(s.ry, -Math.PI * 8, Math.PI * 8),
      moving: Boolean(s.moving),
      pose: ['walk', 'climb', 'sleep'].includes(s.pose) ? s.pose : 'walk'
    };
    broadcast(room, { type: 'state', player: snapshot(peer) }, ws);
  });

  ws.on('close', () => {
    room.delete(peer.id);
    broadcast(room, { type: 'leave', id: peer.id, count: room.size });
    if (room.size === 0) rooms.delete(roomCode);
  });
  ws.on('error', () => {});
});

server.listen(PORT, HOST, () => {
  console.log(`Ngu Bu online dang chay tai http://localhost:${PORT}`);
  console.log('WebSocket endpoint: /ws');
});
