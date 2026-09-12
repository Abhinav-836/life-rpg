import { useState } from 'react';
import { QUEST_CATEGORIES, QUEST_PRIORITIES } from '../../../config/constants.js';
import Input from '../../../components/common/Input.jsx';
import Select from '../../../components/common/Select.jsx';
import Button from '../../../components/common/Button.jsx';
import ErrorMessage from '../../../components/common/ErrorMessage.jsx';
import { getErrorMessage } from '../../../utils/errorHandler.js';

// Shared by AddQuestModal and EditQuestModal so quest fields, validation,
// and reward-suggestion logic live in exactly one place.
export default function QuestForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    category: initial?.category || QUEST_CATEGORIES[0].id,
    priority: initial?.priority || 'medium',
    dueDate: initial?.dueDate || new Date().toISOString().slice(0, 10),
    xp: initial?.xp ?? 20,
    gold: initial?.gold ?? 5,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Every quest needs a title.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ ...form, xp: Number(form.xp), gold: Number(form.gold) });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}
      <Input
        label="Quest title"
        value={form.title}
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
          onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
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
          label="XP reward"
          type="number"
          min="1"
          value={form.xp}
          onChange={(e) => setForm((f) => ({ ...f, xp: e.target.value }))}
        />
        <Input
          label="Gold reward"
          type="number"
          min="0"
          value={form.gold}
          onChange={(e) => setForm((f) => ({ ...f, gold: e.target.value }))}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={submitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}
