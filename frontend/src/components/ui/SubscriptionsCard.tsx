"use client";

import React, { useEffect, useState, MouseEvent } from "react";

import { EllipsisVertical, PencilIcon, Trash2Icon } from "lucide-react";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";

import { formatCurrency } from "@/src/utils/format-currency";
import {
  Subscription,
  useSubscriptionStore,
} from "@/src/store/useSubscriptionStore";

interface Props {
  bankId: string;
  currencyType: string;
  onEdit: (sub: Subscription) => void;
  onDelete: (subId: string) => void;
}

export default function SubscriptionsCard({
  bankId,
  currencyType,
  onEdit,
  onDelete,
}: Props) {
  const { subscriptions, listSubscriptions, isLoading } =
    useSubscriptionStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuSubId, setMenuSubId] = useState<string | null>(null);

  useEffect(() => {
    if (bankId) listSubscriptions(bankId);
  }, [bankId, listSubscriptions]);

  if (isLoading) {
    return <p>Carregando assinaturas…</p>;
  }
  if (subscriptions.length === 0) {
    return <p className="text-light/60">Nenhuma assinatura cadastrada.</p>;
  }

  const handleMenuOpen = (event: MouseEvent<HTMLElement>, subId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuSubId(subId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuSubId(null);
  };

  const handleEdit = () => {
    const sub = subscriptions.find((s) => s._id === menuSubId);
    if (sub) onEdit(sub);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (menuSubId && confirm("Deseja realmente remover esta assinatura?")) {
      onDelete(menuSubId);
    }
    handleMenuClose();
  };

  return (
    <div>
      <ul>
        {subscriptions.map((item) => (
          <li key={item._id} className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="h-4 w-4 rounded-full bg-blue-500" />
              <span className="text-sm">{item.platform}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-1 text-sm">
                <span className="font-zona-pro font-bold">
                  {formatCurrency(item.amount)}
                </span>
                <span className="font-light">{currencyType}</span>
              </div>

              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, item._id)}
              >
                <EllipsisVertical className="text-light/50 hover:text-light" />
              </IconButton>
            </div>
          </li>
        ))}
      </ul>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 120 },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <PencilIcon size={16} className="text-dark/70" />
          </ListItemIcon>
          <ListItemText>
            <span className="font-inter! text-sm font-light">Editar</span>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Trash2Icon size={16} className="text-dark/70" />
          </ListItemIcon>
          <ListItemText>
            <span className="font-inter! text-sm font-light">Deletar</span>
          </ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
