#!/usr/bin/env node
/**
 * Supabase 테이블 초기화 스크립트
 *
 * 사용법:
 *   pnpm setup:db
 *   또는 .env에 SUPABASE_URL, SUPABASE_SECRET_KEY 설정 후 실행
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import * as readline from 'readline';

function loadEnvFile(path) {
    if (!existsSync(path)) return {};
    return Object.fromEntries(
        readFileSync(path, 'utf-8')
            .split('\n')
            .filter((line) => line.trim() && !line.startsWith('#'))
            .map((line) => {
                const idx = line.indexOf('=');
                return [
                    line.slice(0, idx).trim(),
                    line
                        .slice(idx + 1)
                        .trim()
                        .replace(/^["']|["']$/g, ''),
                ];
            }),
    );
}

const env = { ...loadEnvFile(resolve(process.cwd(), '.env')), ...process.env };

async function prompt(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) =>
        rl.question(question, (ans) => {
            rl.close();
            resolve(ans.trim());
        }),
    );
}

async function getEnv(key, label) {
    if (env[key]) return env[key];
    const value = await prompt(`  ${label} [${key}]: `);
    if (!value) {
        console.error(`\n✗ ${key}는 필수입니다.`);
        process.exit(1);
    }
    return value;
}

const PLAVE_MEMBERS = [
    {
        name: '예준',
        color: '#2F325C',
        comments: '집중 좋았어. 이번엔 더 완벽하게 가보자',
        profile: 'https://media.tenor.com/_unP3Jgs9oEAAAAC/yejun-plave.gif',
    },
    {
        name: '노아',
        color: '#D8C3A5',
        comments: '집중해. 탄다 탄다~',
        profile:
            'https://media.tenor.com/o3V-Tzt3OVEAAAAC/plave-%ED%94%8C%EB%A0%88%EC%9D%B4%EB%B8%8C.gif',
    },
    {
        name: '밤비',
        color: '#DC92B5',
        comments: '헉! 방금 완전 황금 붕어빵!',
        profile: 'https://media.tenor.com/Ya0S53iVejkAAAAC/plave.gif',
    },
    {
        name: '은호',
        color: '#E7E5E8',
        comments: '타는 냄새 나면 곤란한데.',
        profile: 'https://media.tenor.com/uPNfP21ch20AAAAC/eunho-do-eunho.gif',
    },
    {
        name: '하민',
        color: '#383636',
        comments: '붕어빵이 행복해 보이는데.',
        profile:
            'https://media.tenor.com/Mnmy_V_5fo8AAAAC/plave-%ED%94%8C%EB%A0%88%EC%9D%B4%EB%B8%8C.gif',
    },
];

const SCHEMA_SQL = `
-- 1. plave-member (캐릭터 목록, 정적 레퍼런스)
CREATE TABLE IF NOT EXISTS "plave-member" (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT NOT NULL,
  "group"    TEXT NOT NULL DEFAULT 'plave',
  profile    TEXT,
  color      TEXT,
  comments   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. member (게임 플레이어)
CREATE TABLE IF NOT EXISTS member (
  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name      TEXT NOT NULL,
  character BIGINT NOT NULL REFERENCES "plave-member"(id),
  code      TEXT NOT NULL
);

-- 3. ranking (최고 점수, 플레이어당 1개)
CREATE TABLE IF NOT EXISTS ranking (
  id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  score  INTEGER NOT NULL,
  member BIGINT NOT NULL,
  CONSTRAINT ranking_member_fkey FOREIGN KEY (member) REFERENCES member(id)
);
`.trim();

async function main() {
    console.log('\nSupabase 테이블 초기화\n');
    console.log('  .env 또는 환경변수에서 키를 읽습니다.');
    console.log('  값이 없으면 직접 입력할 수 있습니다.\n');

    const url = await getEnv('SUPABASE_URL', 'Supabase Project URL');
    const key = await getEnv('SUPABASE_SECRET_KEY', 'Supabase Service Role Key (secret)');

    const supabase = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    console.log('\n테이블 존재 여부 확인 중...');
    const { error } = await supabase.from('plave-member').select('id').limit(1);

    if (error) {
        console.log('\n  plave-member 테이블이 없습니다.');
        console.log('  Supabase 대시보드 → SQL 에디터에서 아래 SQL을 실행하세요:\n');
        console.log('─'.repeat(60));
        console.log(SCHEMA_SQL);
        console.log('─'.repeat(60));
        console.log('\n  SQL 실행 후 다시 이 스크립트를 실행하면 시드 데이터가 삽입됩니다.');
        console.log('  대시보드: https://supabase.com/dashboard/project/_/sql\n');
        process.exit(0);
    }

    console.log('  ✓ 테이블 확인 완료');

    // ── plave-member 시드 ───────────────────────────────────────────────────
    console.log('\n시드 데이터 삽입 중...');
    const { data: existing } = await supabase.from('plave-member').select('name');
    const existingNames = new Set((existing ?? []).map((r) => r.name));
    const toInsert = PLAVE_MEMBERS.filter((m) => !existingNames.has(m.name));

    if (toInsert.length === 0) {
        console.log('  ✓ 모든 멤버가 이미 존재합니다.');
    } else {
        const { error: insertError } = await supabase.from('plave-member').insert(toInsert);
        if (insertError) {
            console.error('  ✗ 시드 삽입 실패:', insertError.message);
            process.exit(1);
        }
        console.log(`  ✓ ${toInsert.length}명 삽입: ${toInsert.map((m) => m.name).join(', ')}`);
    }

    console.log('\n완료! 이제 서버를 실행하세요:\n');
    console.log('     cp .env.example .env   # 아직 안 했다면');
    console.log('     pnpm run dev\n');
}

main().catch((err) => {
    console.error('\n✗', err.message);
    process.exit(1);
});
