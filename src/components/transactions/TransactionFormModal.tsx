import { useState, useCallback, useEffect } from 'react';
import Modal from '../ui/Modal';
import TextInput from '../ui/TextInput';
import SelectInput from '../ui/SelectInput';
import Button from '../ui/Button';
import { ALL_CATEGORIES } from '../../constants/categoryConfig';
import { useTransactionStore } from '../../store/transactionStore';
import type { Transaction, TransactionKind, SpendingCategory } from '../../types/finance';

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  editingTransaction: Transaction | null;
}

interface FormData {
  description: string;
  amount: string;
  kind: TransactionKind;
  category: SpendingCategory;
  date: string;
}

const initialFormData: FormData = {
  description: '',
  amount: '',
  kind: 'expense',
  category: 'Food & Dining',
  date: new Date().toISOString().slice(0, 10),
};

/** Modal form for adding/editing transactions with full validation */
const TransactionFormModal = ({ open, onClose, editingTransaction }: TransactionFormModalProps) => {
  const { addEntry, modifyEntry } = useTransactionStore();
  const [form, setForm] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const isEditMode = editingTransaction !== null;

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        description: editingTransaction.description,
        amount: editingTransaction.amount.toString(),
        kind: editingTransaction.kind,
        category: editingTransaction.category,
        date: editingTransaction.date,
      });
    } else {
      setForm(initialFormData);
    }
    setErrors({});
  }, [editingTransaction, open]);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.description.trim()) newErrors.description = 'Description is required';
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!form.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      const entry = {
        description: form.description.trim(),
        amount: parseFloat(form.amount),
        kind: form.kind,
        category: form.category,
        date: form.date,
      };

      if (isEditMode && editingTransaction) {
        modifyEntry(editingTransaction.id, entry);
      } else {
        addEntry(entry);
      }
      onClose();
    },
    [form, validate, isEditMode, editingTransaction, addEntry, modifyEntry, onClose]
  );

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const categoryOptions = ALL_CATEGORIES.map((c) => ({ value: c, label: c }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditMode ? 'Edit Transaction' : 'Add Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <TextInput
            id="form-description"
            label="Description"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="e.g. Swiggy dinner"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        <div>
          <TextInput
            id="form-amount"
            label="Amount (₹)"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={(e) => updateField('amount', e.target.value)}
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
          )}
        </div>

        {/* Type radio group */}
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Type</p>
          <div className="flex gap-3">
            {(['income', 'expense'] as TransactionKind[]).map((kind) => (
              <label
                key={kind}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-medium cursor-pointer transition-all ${
                  form.kind === kind
                    ? kind === 'income'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-600'
                      : 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-600'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="kind"
                  value={kind}
                  checked={form.kind === kind}
                  onChange={() => updateField('kind', kind)}
                  className="sr-only"
                />
                {kind === 'income' ? '↑ Income' : '↓ Expense'}
              </label>
            ))}
          </div>
        </div>

        <SelectInput
          id="form-category"
          label="Category"
          value={form.category}
          onChange={(e) => updateField('category', e.target.value as SpendingCategory)}
          options={categoryOptions}
        />

        <div>
          <TextInput
            id="form-date"
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => updateField('date', e.target.value)}
          />
          {errors.date && (
            <p className="mt-1 text-xs text-red-500">{errors.date}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            {isEditMode ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionFormModal;
