import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { loadBuyerOptions, type BuyerOption } from "@/data/buyerMaster";

interface BuyerAutocompleteProps {
  register: any;
  setValue: any;
  watch: any;
  errors: any;
}

export function BuyerAutocomplete({ register, setValue, watch, errors }: BuyerAutocompleteProps) {
  const buyerNameValue = watch("buyerName") || "";
  const registerBuyerName = register("buyerName");
  const [buyerOptions, setBuyerOptions] = useState<BuyerOption[]>(loadBuyerOptions());
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerOption | null>(null);
  const [searchText, setSearchText] = useState(buyerNameValue);
  const [debouncedQuery, setDebouncedQuery] = useState(buyerNameValue.trim());
  const [showOptions, setShowOptions] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const billingAddressValue = watch("billingAddress") || "";
  const shippingAddressValue = watch("shippingAddress") || "";

  useEffect(() => {
    setSearchText(buyerNameValue);
  }, [buyerNameValue]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(searchText.trim()), 200);
    return () => window.clearTimeout(timeout);
  }, [searchText]);

  const filteredOptions = useMemo(() => {
    const query = debouncedQuery.toLowerCase();
    if (!query) return buyerOptions.slice(0, 12);
    return buyerOptions.filter((option) => option.searchKey.includes(query)).slice(0, 35);
  }, [buyerOptions, debouncedQuery]);

  const hasNoMatch = Boolean(searchText.trim() && !filteredOptions.length);

  const handleBuyerSelect = (option: BuyerOption) => {
    setSelectedBuyer(option);
    setSearchText(option.label);
    setShowOptions(false);
    setValue("buyerName", option.label, { shouldDirty: true, shouldTouch: true });
    setValue("gstNumber", option.gstNumber || "", { shouldDirty: true, shouldTouch: true });
    setValue("mobile", option.mobile || "", { shouldDirty: true, shouldTouch: true });
    setValue("email", option.email || "", { shouldDirty: true, shouldTouch: true });
    setValue("billingAddress", option.billingAddress || "", { shouldDirty: true, shouldTouch: true });
    setValue("state", option.state || "", { shouldDirty: true, shouldTouch: true });
    setValue("pincode", option.pincode || "", { shouldDirty: true, shouldTouch: true });
    if (option.city) {
      setValue("city", option.city, { shouldDirty: true, shouldTouch: true });
    }
  };

  const handleManualEntry = () => {
    setSelectedBuyer(null);
    setShowOptions(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:rounded-[28px] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-col gap-1.5 sm:gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.3em] dark:text-slate-400">Buyer Information</p>
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-slate-100">Select or add a buyer</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          Search buyer master data for fast selection, or enter buyer details manually if the buyer is not listed.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Buyer company name
          </label>
          <Input
            {...registerBuyerName}
            ref={registerBuyerName.ref}
            value={searchText}
            onChange={(event) => {
              const value = event.target.value;
              setSearchText(value);
              setShowOptions(true);
              if (selectedBuyer?.label !== value) {
                setSelectedBuyer(null);
              }
              registerBuyerName.onChange(event);
            }}
            onFocus={() => setShowOptions(true)}
            onBlur={(event) => {
              setTimeout(() => setShowOptions(false), 120);
              registerBuyerName.onBlur(event);
            }}
            placeholder="Search by name, GSTIN, email or mobile"
          />
          {errors?.buyerName && (
            <p className="mt-2 text-xs text-destructive">{errors.buyerName.message}</p>
          )}

          {showOptions && (filteredOptions.length > 0 || hasNoMatch) && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-lg ring-1 ring-slate-200 dark:border-slate-700 dark:bg-slate-950">
              {filteredOptions.length > 0 ? (
                <div ref={resultsRef} role="listbox">
                  {filteredOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleBuyerSelect(option)}
                      className="w-full px-4 py-3 text-left transition hover:bg-slate-100 dark:hover:bg-slate-900"
                    >
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{option.label}</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {option.gstNumber ? `GSTIN: ${option.gstNumber}` : "GSTIN unavailable"}
                        {option.email ? ` · ${option.email}` : ""}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 p-4 text-sm text-slate-600 dark:text-slate-400">
                  <p>No matching buyer found.</p>
                  <Button variant="outline" size="sm" type="button" onClick={handleManualEntry}>
                    Add new buyer
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">GSTIN</label>
            <Input {...register("gstNumber")} placeholder="29XXXXX0000X1ZX" />
            {errors?.gstNumber && <p className="mt-2 text-xs text-destructive">{errors.gstNumber.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Mobile Number</label>
            <Input {...register("mobile")} placeholder="+91 98765 43210" />
            {errors?.mobile && <p className="mt-2 text-xs text-destructive">{errors.mobile.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email Address</label>
            <Input {...register("email")} placeholder="buyer@example.com" />
            {errors?.email && <p className="mt-2 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Pincode</label>
            <Input {...register("pincode")} placeholder="560001" />
            {errors?.pincode && <p className="mt-2 text-xs text-destructive">{errors.pincode.message}</p>}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Billing Address</label>
          <Textarea {...register("billingAddress")} placeholder="Billing address" rows={3} />
          {errors?.billingAddress && <p className="mt-2 text-xs text-destructive">{errors.billingAddress.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">State</label>
            <Input {...register("state")} placeholder="State" />
            {errors?.state && <p className="mt-2 text-xs text-destructive">{errors.state.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Contact Person</label>
            <Input {...register("contactName")} placeholder="Contact name" />
            {errors?.contactName && <p className="mt-2 text-xs text-destructive">{errors.contactName.message}</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          The selected buyer data was applied automatically. You can edit values manually at any time.
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Shipping Address</label>
          <Textarea {...register("shippingAddress")} placeholder="Shipping address (leave same if same as billing)" rows={3} />
        </div>
      </div>
    </div>
  );
}
