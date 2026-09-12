import { useState } from 'react';
import Modal from '../../../components/common/Modal.jsx';
import Button from '../../../components/common/Button.jsx';
import ErrorMessage from '../../../components/common/ErrorMessage.jsx';
import { getErrorMessage } from '../../../utils/errorHandler.js';
import { playSound } from '../../../utils/sound.js';
import RewardDetails from './RewardDetails.jsx';
import PurchaseSuccess from './PurchaseSuccess.jsx';

export default function PurchaseModal({ reward, gold, onClose, onRedeem }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [purchased, setPurchased] = useState(false);

  if (!reward) return null;
  const affordable = gold >= reward.price;

  async function handleConfirm() {
    setError('');
    setLoading(true);
    try {
      await onRedeem(reward.id);
      setPurchased(true);
      playSound('purchase');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={!!reward} onClose={onClose} title={purchased ? undefined : 'Redeem reward'}>
      {purchased ? (
        <PurchaseSuccess reward={reward} />
      ) : (
        <>
          <RewardDetails reward={reward} />
          {error && <ErrorMessage message={error} />}
          {!affordable && !error && (
            <p className="text-sm text-danger mb-4">
              You need {reward.price - gold} more gold to redeem this.
            </p>
          )}
        </>
      )}
      <div className="flex justify-end gap-3 mt-2">
        <Button variant="ghost" onClick={onClose}>{purchased ? 'Close' : 'Cancel'}</Button>
        {!purchased && (
          <Button onClick={handleConfirm} loading={loading} disabled={!affordable} variant="gold">
            Redeem for {reward.price}g
          </Button>
        )}
      </div>
    </Modal>
  );
}
