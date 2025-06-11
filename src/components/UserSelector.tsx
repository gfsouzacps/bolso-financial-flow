
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/contexts/TransactionContext';
import { cn } from '@/lib/utils';

export function UserSelector() {
  const { users, currentUser, setCurrentUser } = useTransactions();

  return (
    <div className="flex items-center gap-2 p-4 bg-card rounded-lg border">
      <span className="text-sm font-medium">Quem está usando:</span>
      <div className="flex gap-2">
        {users.map((user) => (
          <Button
            key={user.id}
            variant={currentUser?.id === user.id ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentUser(user)}
            className="flex items-center gap-2"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className={cn("text-white text-xs", user.color)}>
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {user.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
