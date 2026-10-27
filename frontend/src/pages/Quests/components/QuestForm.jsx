import { useState } from 'react';
import {
  QUEST_CATEGORIES, QUEST_PRIORITIES, PRIORITY_TO_DIFFICULTY, REWARD_LIMITS,
} from '../../../config/constants.js';
import Input from '../../../components/common/Input.jsx';
import Select from '../../../components/common/Select.jsx';
import Button from '../../../components/common/Button.jsx';
import ErrorMessage from '../../../components/common/ErrorMessage.jsx';
import { getErrorMessage } from '../../../utils/errorHandler.js';
import { toLocalDateKey } from '../../../utils/dates.js';

const limitsFor = (priority) => REWARD_LIMITS[PRIORITY_TO_DIFFICULTY[priority]] || REWARD_LIMITS.normal;

// Shared by AddQuestModal and EditQuestModal so quest fields, validation
// and reward rules live in exactly one place.
export default function QuestForm({ initial, submitLabel, onSubmit, onCancel }) {
  const startPriority = initial?.priority || 'medium';
  const [form, setForm] = useState({
    title: initial?.title || '',
    category: initial?.category || QUEST_CATEGORIES[0].id,
    priority: startPriority,
    dueDate: initial?.dueDate || toLocalDateKey(),
    xp: initial?.xp ?? limitsFor(startPriority).defaultXp,
    gold: initial?.gold ?? limitsFor(startPriority).defaultGold,
  });
  // Until the player types their own reward, follow the priority's default.
  const [rewardTouched, setRewardTouched] = useState(Boolean(initial));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const limits = limitsFor(form.priority);

  function changePriority(priority) {
    const next = limitsFor(priority);
    setForm((f) => (rewardTouched
      ? { ...f, priority }
      : { ...f, priority, xp: next.defaultXp, gold: next.defaultGold }));
  }

  function changeReward(field, value) {
    setRewardTouched(true);
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const title = form.title.trim();
    const xp = Number(form.xp);
    const gold = Number(form.gold);

    if (!title) return setError('Every quest needs a title.');
    if (title.length > 120) return setError('Keep the title under 120 characters.');
    if (!Number.isFinite(xp) || xp < limits.xp.min || xp > limits.xp.max) {
      return setError(`XP for this priority must be between ${limits.xp.min} and ${limits.xp.max}.`);
    }
    if (!Number.isFinite(gold) || gold < limits.gold.min || gold > limits.gold.max) {
      return setError(`Gold for this priority must be between ${limits.gold.min} and ${limits.gold.max}.`);
    }

    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ ...form, title, xp, gold });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
    return undefined;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}
      <Input
        label="Quest title"
        value={form.title}
        maxLength={120}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        placeholder="e.g. Finish the API integration"
        autoFocus
      />
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          options={QUEST_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
        />
        <Select
          label="Priority"
          value={form.priority}
          onChange={(e) => changePriority(e.target.value)}
          options={QUEST_PRIORITIES.map((p) => ({ id: p.id, label: p.label }))}
        />
      </div>
      <Input
        label="Due date"
        type="date"
        value={form.dueDate}
        onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label={`XP reward (${limits.xp.min}–${limits.xp.max})`}
          type="number"
          min={limits.xp.min}
          max={limits.xp.max}
          value={form.xp}
          onChange={(e) => changeReward('xp', e.target.value)}
        />
        <Input
          label={`Gold reward (${limits.gold.min}–${limits.gold.max})`}
          type="number"
          min={limits.gold.min}
          max={limits.gold.max}
          value={form.gold}
          onChange={(e) => changeReward('gold', e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={submitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}